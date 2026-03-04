using System;
using System.Data;
using Oracle.ManagedDataAccess.Client; // Using the managed Oracle driver for .NET 9

/// <summary>
/// Summary description for CONNECTION
/// </summary>
public class CONNECTION
{
    private OracleConnection _conn;

    public CONNECTION()
    {
    }

    /// <summary>
    /// Opens a connection to the Oracle database using parameters.
    /// In modern .NET, we usually get these from configuration.
    /// </summary>
    public void OpenConnection(string userId, string password, string dataSource)
    {
        try
        {
            string connectionString = $"User Id={userId};Password={password};Data Source={dataSource};Pooling=false;";
            _conn = new OracleConnection(connectionString);
            _conn.Open();
        }
        catch (Exception ex)
        {
            // Log error or rethrow
            throw new Exception($"Failed to open connection: {ex.Message}", ex);
        }
    }

    public OracleConnection GetCon()
    {
        return _conn;
    }

    public void Close()
    {
        try
        {
            if (_conn != null && _conn.State == ConnectionState.Open)
            {
                _conn.Close();
                _conn.Dispose();
            }
        }
        catch (Exception ex)
        {
            // Logging can be added here
            string error = ex.Message;
        }
    }
}
