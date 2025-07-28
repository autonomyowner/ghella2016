import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/supabaseClient';

interface DiagnosticError {
  message: string;
  code: string;
  details?: string;
  hint?: string;
}

interface TableDiagnostic {
  exists: boolean;
  error: DiagnosticError | null;
  rowCount: number;
}

interface RLSDiagnostic {
  select: boolean;
  insert: boolean;
  update: boolean;
  delete: boolean;
  error: DiagnosticError | null;
}

interface Diagnostics {
  timestamp: string;
  connection: {
    status: 'testing' | 'success' | 'failed';
    error: DiagnosticError | null;
    responseTime: number;
  };
  tables: Record<string, TableDiagnostic>;
  rls: Record<string, RLSDiagnostic>;
  permissions: Record<string, any>;
  recommendations: string[];
  summary?: {
    connectionWorking: boolean;
    tablesWorking: number;
    totalTables: number;
    successRate: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const diagnostics: Diagnostics = {
      timestamp: new Date().toISOString(),
      connection: {
        status: 'testing',
        error: null,
        responseTime: 0
      },
      tables: {},
      rls: {},
      permissions: {},
      recommendations: []
    };

    // Test basic connection
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      const responseTime = Date.now() - startTime;
      
      if (error) {
        diagnostics.connection.status = 'failed';
        diagnostics.connection.error = {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        };
        diagnostics.recommendations.push('تحقق من إعدادات Supabase URL و API Key');
      } else {
        diagnostics.connection.status = 'success';
        diagnostics.connection.responseTime = responseTime;
      }
    } catch (error) {
      diagnostics.connection.status = 'failed';
      diagnostics.connection.error = {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: 'CONNECTION_ERROR'
      };
      diagnostics.recommendations.push('تحقق من الاتصال بالإنترنت وإعدادات Supabase');
    }

    // Test table existence and structure
    const tables = ['equipment', 'animal_listings', 'land_listings', 'nurseries', 'vegetables', 'profiles', 'categories'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        diagnostics.tables[table] = {
          exists: !error,
          error: error ? {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          } : null,
          rowCount: data ? data.length : 0
        };

        if (error) {
          diagnostics.recommendations.push(`جدول ${table} غير موجود أو لا يمكن الوصول إليه`);
        }
      } catch (error) {
        diagnostics.tables[table] = {
          exists: false,
          error: {
            message: error instanceof Error ? error.message : 'Unknown error',
            code: 'TABLE_ERROR'
          },
          rowCount: 0
        };
      }
    }

    // Test RLS policies
    for (const table of tables) {
      if (diagnostics.tables[table]?.exists) {
        try {
          // Test SELECT permission
          const { data: selectData, error: selectError } = await supabase
            .from(table)
            .select('*')
            .limit(1);

          diagnostics.rls[table] = {
            select: !selectError,
            insert: false,
            update: false,
            delete: false,
            error: selectError ? {
              message: selectError.message,
              code: selectError.code,
              details: selectError.details,
              hint: selectError.hint
            } : null
          };

          if (selectError) {
            diagnostics.recommendations.push(`تحقق من سياسات RLS للقراءة في جدول ${table}`);
          }
        } catch (error) {
          diagnostics.rls[table] = {
            select: false,
            insert: false,
            update: false,
            delete: false,
            error: {
              message: error instanceof Error ? error.message : 'Unknown error',
              code: 'RLS_ERROR'
            }
          };
        }
      }
    }

    // Generate summary
    const workingTables = Object.values(diagnostics.tables).filter((table) => table.exists).length;
    const totalTables = tables.length;
    
    diagnostics.summary = {
      connectionWorking: diagnostics.connection.status === 'success',
      tablesWorking: workingTables,
      totalTables,
      successRate: (workingTables / totalTables) * 100
    };

    if (diagnostics.connection.status === 'success' && workingTables === 0) {
      diagnostics.recommendations.push('الاتصال ناجح ولكن لا توجد جداول - تحقق من إنشاء الجداول');
    }

    if (workingTables > 0 && Object.values(diagnostics.rls).some((rls) => !rls.select)) {
      diagnostics.recommendations.push('بعض الجداول لا يمكن قراءتها - تحقق من سياسات RLS');
    }

    return NextResponse.json(diagnostics, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 