import initSqlJs from 'sql.js';

export class SQLExecutor {
  constructor() {
    this.db = null;
    this.SQL = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      this.SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });
      this.db = new this.SQL.Database();
      this.initialized = true;
      console.log('SQL.js initialized successfully');
    } catch (error) {
      console.error('Failed to initialize SQL.js:', error);
      throw error;
    }
  }

  async loadDataset(schema, data) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Drop all existing tables
      const tables = this.db.exec("SELECT name FROM sqlite_master WHERE type='table'");
      if (tables.length > 0 && tables[0].values) {
        tables[0].values.forEach(([tableName]) => {
          this.db.run(`DROP TABLE IF EXISTS ${tableName}`);
        });
      }

      // Execute schema creation
      schema.forEach(statement => {
        this.db.run(statement);
      });

      // Insert data
      data.forEach(statement => {
        this.db.run(statement);
      });

      console.log('Dataset loaded successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to load dataset:', error);
      return { success: false, error: error.message };
    }
  }

  async executeQuery(sql) {
    if (!this.initialized) {
      return {
        success: false,
        error: 'Database not initialized. Please load a dataset first.'
      };
    }

    try {
      const start = performance.now();
      const results = this.db.exec(sql);
      const executionTime = (performance.now() - start).toFixed(2);

      // Format results for easier consumption
      const formattedResults = results.map(result => ({
        columns: result.columns,
        values: result.values
      }));

      return {
        success: true,
        results: formattedResults,
        executionTime: `${executionTime}ms`,
        rowCount: results.reduce((sum, r) => sum + r.values.length, 0)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  getTableInfo() {
    if (!this.initialized || !this.db) {
      return [];
    }

    try {
      const tables = this.db.exec(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
      );

      if (tables.length === 0 || !tables[0].values) {
        return [];
      }

      return tables[0].values.map(([tableName]) => {
        const info = this.db.exec(`PRAGMA table_info(${tableName})`);
        const columns = info[0]?.values.map(col => ({
          name: col[1],
          type: col[2],
          notNull: col[3] === 1,
          primaryKey: col[5] === 1
        })) || [];

        return {
          name: tableName,
          columns
        };
      });
    } catch (error) {
      console.error('Failed to get table info:', error);
      return [];
    }
  }

  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initialized = false;
    }
  }
}

// Create a singleton instance
export const sqlExecutor = new SQLExecutor();
