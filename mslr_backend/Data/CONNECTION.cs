using System;
using System.Data;
using Oracle.ManagedDataAccess.Client;

namespace MslrBackend.Data
{

    public class CONNECTION
    {
        public CONNECTION()
        {
        }

        public OracleConnection Conn;

        /// <summary>
        /// Opens an Oracle connection using hardcoded credentials.
        /// </summary>
        public void openConnection()
        {
            // Hardcoded connection credentials
            string dbUser   = "MSLR";
            string dbPwd    = "MSLR";
            string dbServer = "192.168.250.22:1521/orcl";

            try
            {
                string connectionString = $"User Id={dbUser};Password={dbPwd};Data Source={dbServer};Pooling=false;";
                Conn = new OracleConnection(connectionString);
                Conn.Open();
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to open connection: {ex.Message}", ex);
            }
        }

        public OracleConnection GetCon()
        {
            return Conn;
        }

        public void Close()
        {
            try
            {
                if (Conn != null && Conn.State == ConnectionState.Open)
                {
                    Conn.Close();
                    Conn.Dispose();
                }
            }
            catch (Exception ex)
            {
                string error = ex.Message;
            }
        }
    }
}
