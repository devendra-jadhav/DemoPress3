using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;


namespace Press3.BusinessRulesLayer
{
    public static class CustomExtensions
    {
        public static void AppedTo(this UserDefinedClasses.HttpParameters httpParameters, ref JObject refObject)
        {
            try
            {
                JObject httpParametersObject = new JObject();
                foreach (System.Reflection.PropertyInfo propertyInfo in httpParameters.GetType().GetProperties())
                {
                    if (propertyInfo.GetValue(httpParameters) == null)
                        if ("RequestUuid,SequenceNumber,ConferenceName,ConferenceMemberID,TalkingAgentRequestUUID,IsTransferToAgent,IsWarmTransfer,CallerFsMemberId,CallerSequenceNumber,IsCaller,IsAgent,IsVertoPhone,IsRingUrl".Split(new char[] { ',' }).Contains(propertyInfo.Name))
                            httpParametersObject.Add(new JProperty(propertyInfo.Name, "null"));
                        else
                            if ("RequestUuid,SequenceNumber,ConferenceName,ConferenceMemberID,TalkingAgentRequestUUID,IsTransferToAgent,IsWarmTransfer,CallerFsMemberId,CallerSequenceNumber,IsCaller,IsAgent,IsVertoPhone,IsRingUrl".Split(new char[] { ',' }).Contains(propertyInfo.Name))
                                httpParametersObject.Add(new JProperty(propertyInfo.Name, propertyInfo.GetValue(httpParameters).ToString()));
                }
                if (refObject == null)
                    Utilities.Logger.Error(string.Format("RefObject is null. Cannot append"));
                else
                    refObject.Add(new JProperty("HttpParameters", httpParametersObject));
            }
            catch(Exception e)
            {
                Utilities.Logger.Error(string.Format("Exception while appending httpparameters to json. {0}", e.ToString()));
            }

        }
        public static void Trace(this UserDefinedClasses.HttpParameters httpParameters, JObject eventData)
        {
            try
            {
                JObject httpParametersObject = new JObject();
                foreach (System.Reflection.PropertyInfo propertyInfo in httpParameters.GetType().GetProperties())
                {
                    if (propertyInfo.GetValue(httpParameters) == null)
                        //if ("RequestUuid,SequenceNumber,ConferenceName,ConferenceMemberID,TalkingAgentRequestUUID,IsTransferToAgent,IsWarmTransfer,CallerFsMemberId,CallerSequenceNumber,IsCaller,IsAgent,IsVertoPhone,IsRingUrl".Split(new char[] { ',' }).Contains(propertyInfo.Name))
                        httpParametersObject.Add(new JProperty(propertyInfo.Name, "null"));
                    else
                        //if ("RequestUuid,SequenceNumber,ConferenceName,ConferenceMemberID,TalkingAgentRequestUUID,IsTransferToAgent,IsWarmTransfer,CallerFsMemberId,CallerSequenceNumber,IsCaller,IsAgent,IsVertoPhone,IsRingUrl".Split(new char[] { ',' }).Contains(propertyInfo.Name))
                        httpParametersObject.Add(new JProperty(propertyInfo.Name, propertyInfo.GetValue(httpParameters).ToString()));
                }
                if (eventData == null)
                    Utilities.Logger.Error(string.Format("EventData is null. Cannot Log"), true);
                else
                {
                    eventData.Add(new JProperty("HttpParameters", httpParametersObject));
                    Utilities.Logger.Info(eventData.ToString(), true);
                }   
            }
            catch(Exception e)
            {
                Utilities.Logger.Error(string.Format("Exception while Logging httpparameters And json. {0}", e.ToString()), true);
            }
        }
        public static void Trace(this System.Data.DataSet ds, JObject eventData)
        {
            JArray tables = new JArray();
            foreach (System.Data.DataTable table in ds.Tables)
            {
                JObject tableObject = new JObject();
                JArray columnsArray = new JArray();
                JArray rowsArray = new JArray();
                tableObject.Add(new JProperty("Name", table.TableName));
                foreach (System.Data.DataColumn column in table.Columns)
                {
                    columnsArray.Add(column.ColumnName);
                }
                foreach (System.Data.DataRow row in table.Rows)
                {
                    JObject rowObject = new JObject();
                    foreach (System.Data.DataColumn column in table.Columns)
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
            eventData.Add(new JProperty("DataSet", tables));
            Utilities.Logger.Info(eventData.ToString(), true);

        }
        public static void AppendTo(this System.Data.DataSet ds, ref JObject refObject)
        {
            JArray tables = new JArray();
            foreach (System.Data.DataTable table in ds.Tables)
            {
                JObject tableObject = new JObject();
                JArray columnsArray = new JArray();
                JArray rowsArray = new JArray();
                tableObject.Add(new JProperty("Name", table.TableName));
                foreach (System.Data.DataColumn column in table.Columns)
                {
                    columnsArray.Add(column.ColumnName);
                }
                foreach (System.Data.DataRow row in table.Rows)
                {
                    JObject rowObject = new JObject();
                    foreach (System.Data.DataColumn column in table.Columns)
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
            //refObject.Add(new JProperty("DataSet", tables));            
        }
    }
}
