using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using Newtonsoft.Json.Linq;

namespace Press3.Utilities
{
    public static class ExtensionMethods
    {
        public static bool IsNull(this object input)
        {
            return input == null ? true : false;
        }
        public static void Dump(this System.Data.DataRow row)
        {
            foreach(DataColumn dc in row.Table.Columns)
            {
                Utilities.Logger.Info(dc.ColumnName + " ---" + (row[dc.ColumnName].Equals(DBNull.Value) ? "NULL" : row[dc.ColumnName].ToString()));
            }
        }
        public static string ToJSon(this DataSet ds)
        {
            if (ds == null || ds.Tables.Count == 0)
                return string.Empty;
            JArray tables = new JArray();
            foreach(DataTable table in ds.Tables)
            {
                JObject tableObject = new JObject();
                JArray columnsArray = new JArray();
                JArray rowsArray = new JArray();
                tableObject.Add(new JProperty("Name", table.TableName));
                foreach(DataColumn column in table.Columns)
                {
                    columnsArray.Add(column.ColumnName);
                }
                foreach(DataRow row in table.Rows)
                {
                    JObject rowObject = new JObject();
                    foreach(DataColumn column in table.Columns)
                    {
                        if (row[column.ColumnName].Equals(DBNull.Value))
                            rowObject.Add(new JProperty(column.ColumnName, "DBNULL"));
                        else
                            rowObject.Add(new JProperty(column.ColumnName, row[column.ColumnName].ToString()));                        
                    }
                    rowsArray.Add(rowObject);
                }
                tableObject.Add("Columns", columnsArray);
                tableObject.Add("Rows", rowsArray);
                tables.Add(tableObject);
            }
            return tables.ToString();
        }
    }
}
