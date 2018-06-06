using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;

namespace Press3.DataAccessLayer
{
    class Helper
    {
        public DataTable ConvertOutputParametersToDataTable(SqlParameterCollection parameters)
        {
            DataTable outputParameters = new DataTable("OutputParameters");
            for (int iterator = 0; iterator <= parameters.Count - 1; iterator++)
            {
                if (parameters[iterator].Direction == ParameterDirection.Output)
                {
                    outputParameters.Columns.Add(parameters[iterator].ParameterName.Replace("@", ""));                    
                }
            }
            DataRow row = outputParameters.NewRow();
            foreach (DataColumn column in outputParameters.Columns)
            {
                row[column.ColumnName] = parameters["@" + column.ColumnName].Value;
            }
            outputParameters.Rows.Add(row);
            return outputParameters;
        }
        public DataTable CreateOutputParameters(bool isSuccess, string message)
        {
            DataTable outputParams = new DataTable("OutputParameters");
            outputParams.Columns.Add("Success");
            outputParams.Columns.Add("Message");
            outputParams.Rows.Add(isSuccess, message);
            return outputParams;
        }
        public DateTime StartOfDay(DateTime input)
        {
            return input.Date;
        }
        public DateTime EndOfDay(DateTime input)
        {
            return input.Date.AddDays(1).AddTicks(-1);
        }
    }
}
