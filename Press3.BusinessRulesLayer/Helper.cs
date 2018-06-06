using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Xml;
using System.Net;
using System.IO;
using Press3.Utilities;
using Press3.UserDefinedClasses;

namespace Press3.BusinessRulesLayer
{
   
        public class Helper
        {
            private JObject jObj = null;
            private JArray jArr = null;
            private XmlDocument xmlDoc = null;
            private XmlElement rootElement = null;
            private string responseFormat = null;
            private string requestFormat = null;
            public Helper()
            {
                InitializeResponseVariables();
            }
            /// <summary>
            /// Initializes the response variables.
            /// </summary>
            public void InitializeResponseVariables()
            {
                    jObj = new JObject();
                    jArr = new JArray();
            }
            /// <summary>
            /// Converts the data set to json object.
            /// </summary>
            /// <param name="ds">The DataSet.</param>
            /// <returns></returns>       
            /// 
            public string ResponseFormat
            {
                get { return responseFormat; }
                set
                {
                    if (value != Press3.Utilities.ResponseFormat.XML && value != Press3.Utilities.ResponseFormat.JSON)
                    {
                        throw new ArgumentException("Invalid ResponseFormat");
                    }
                    else
                    {
                        responseFormat = value;
                    }
                }
            }
            public void ParseDataSet(DataSet ds, Dictionary<string, TableProperties> tableProperties = null, bool constructAsArrayForOneRow = true)
            {
                if (ds == null)
                {
                    return;
                }
                try
                {
                    TableProperties currentTableProperties = null;
                    string childElementNameForRows = "";
                    bool isColumnValuesAsAttributes = true;
                    bool isBoolean = false;
                    foreach (DataTable table in ds.Tables)
                    {
                        currentTableProperties = null;
                        childElementNameForRows = "";
                        isColumnValuesAsAttributes = true;
                        if (tableProperties != null && tableProperties.ContainsKey(table.TableName))
                        {
                            tableProperties.TryGetValue(table.TableName, out currentTableProperties);
                            if (currentTableProperties != null)
                            {
                                childElementNameForRows = currentTableProperties.ChildElementNameForRows == null ? "" : currentTableProperties.ChildElementNameForRows;
                                isColumnValuesAsAttributes = currentTableProperties.IsColumnValuesAsAttributes == null ? true : currentTableProperties.IsColumnValuesAsAttributes;
                            }
                        }
                        if (table.TableName == "OutputParameters")
                        {
                            foreach (DataColumn column in table.Columns)
                            {
                                isBoolean = false;
                                if (column.ColumnName.Equals("SUCCESS", StringComparison.CurrentCultureIgnoreCase) && table.Columns.Contains("SequenceNumber"))
                                {
                                    try
                                    {
                                        bool.Parse(table.Rows[0][column.ColumnName].ToString());
                                        isBoolean = true;
                                    }
                                    catch (Exception e)
                                    {
                                        isBoolean = false;
                                    }
                                    if(isBoolean)
                                        this.CreateProperty(column.ColumnName, bool.Parse(table.Rows[0][column.ColumnName].ToString()), true);
                                    else
                                        this.CreateProperty(column.ColumnName, table.Rows[0][column.ColumnName], true);
                                }
                                else if (column.ColumnName.Equals("SEQUENCENUMBER", StringComparison.CurrentCultureIgnoreCase))
                                {
                                    this.CreateProperty(column.ColumnName, Convert.ToInt32(table.Rows[0][column.ColumnName].ToString()), true);
                                }
                                else
                                    this.CreateProperty(column.ColumnName, table.Rows[0][column.ColumnName], true);
                            }
                        }
                        else
                        {
                            jArr = new JArray();
                            JObject rowJObj = new JObject();
                            XmlElement tableRootElement = null;
                            XmlElement tableRowElement = null;
                            XmlElement columnElement = null;
                            string columnValue = "";
                           
                            if (!constructAsArrayForOneRow && table.Rows.Count <= 1)
                            {
                                rowJObj = new JObject();
                                if (table.Rows.Count > 0)
                                {
                                    foreach (DataColumn column in table.Columns)
                                    {
                                        if (table.Rows[0][column.ColumnName] is DBNull || table.Rows[0][column.ColumnName] == null)
                                        {
                                            columnValue = "";
                                        }
                                        else
                                        {
                                            columnValue = table.Rows[0][column.ColumnName].ToString();
                                        }
                                        //if (tableRootElement != null && childElementNameForRows.Length > 0) {
                                        //    tableRowElement = xmlDoc.CreateElement(childElementNameForRows);
                                        //}
                                        //else if (tableRowElement != null) {
                                        //    tableRowElement = xmlDoc.CreateElement(table.TableName);
                                        //}
                                        rowJObj.Add(new JProperty(column.ColumnName, columnValue));
                                    }
                                }
                                    jObj.Add(new JProperty(table.TableName, rowJObj));
                            }
                            else
                            {
                                foreach (DataRow row in table.Rows)
                                {
                                    rowJObj = new JObject();
                                    if (tableRootElement != null && childElementNameForRows.Length > 0)
                                    {
                                        tableRowElement = xmlDoc.CreateElement(childElementNameForRows);
                                    }
                                    else if (tableRootElement != null)
                                    {
                                        tableRowElement = xmlDoc.CreateElement(table.TableName);
                                    }
                                    foreach (DataColumn column in table.Columns)
                                    {
                                        if (row[column.ColumnName] is DBNull || row[column.ColumnName] == null)
                                        {
                                            columnValue = "";
                                        }
                                        else
                                        {
                                            columnValue = row[column.ColumnName].ToString();
                                        }
                                       
                                            rowJObj.Add(new JProperty(column.ColumnName, columnValue));
                                    }
                                   
                                        jArr.Add(rowJObj);
                                }
                                    jObj.Add(new JProperty(table.TableName, jArr));
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Logger.Error(ex.ToString());
                }
                finally { }
            }
            public void CreateProperty(string key, object value, bool isInsertFirst = false)
            {
                    if (isInsertFirst)
                    {
                        jObj.AddFirst(new JProperty(key, value));
                    }
                    else
                    {
                        jObj.Add(new JProperty(key, value));
                    }
            }
            public dynamic GetResponse()
            {
              return jObj;
            }
            public void CreateProperty(string key, object value, ref JObject json)
            {
                json.Add(new JProperty(key, value));
            }
        
            public void ResetResponseVariables()
            {
                InitializeResponseVariables();
            }
       
            public class TableProperties
            {
                public TableProperties(string tableName, string childElementNameForRows, bool isColumnValuesAsAttributes)
                {
                    this.TableName = tableName;
                    this.ChildElementNameForRows = childElementNameForRows;
                    this.IsColumnValuesAsAttributes = isColumnValuesAsAttributes;
                }
                public string TableName { get; set; }
                public string ChildElementNameForRows { get; set; }
                public bool IsColumnValuesAsAttributes { get; set; }
            }
           
        }

    }