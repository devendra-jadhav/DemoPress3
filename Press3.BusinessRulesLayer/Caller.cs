using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using System.Data;
using Press3.Utilities;
using UDC = Press3.UserDefinedClasses;
using System.Web;
using System.Data.OleDb;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using System.Net.Mail;

namespace Press3.BusinessRulesLayer
{
    public class Caller
    {
        private Helper helper = null;
        public Caller()
        {
            helper = new Helper();
            helper.ResponseFormat = "json";
            helper.InitializeResponseVariables();
        }

        public JObject GetCallerCallHistory(String connection,int accountId,string fromNumber,int callId,int pageSize,int pageNumber)
        {
            
            try
            {
                JObject responseJobj = new JObject();
                JObject callHistoryObj = new JObject();
                JObject tempJobj = new JObject();
                JObject ticketJobj = new JObject();
                JArray callHistoryJarr = new JArray();
                JArray ticketsJarr = new JArray();
                Press3.DataAccessLayer.Caller agentObject = new Press3.DataAccessLayer.Caller(connection);
                DataSet ds = agentObject.GetCallerCallHistory(accountId,fromNumber,callId,pageSize,pageNumber);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    if(ds.Tables[0].Rows.Count > 0)
                    {
                        foreach(DataRow _dr in ds.Tables[0].Rows)
                        {
                            callHistoryObj = new JObject();
                            foreach (DataColumn _dc in ds.Tables[0].Columns)
                            {
                                callHistoryObj.Add(new JProperty(_dc.ColumnName, _dr[_dc.ColumnName]));
                            }
                            DataRow[] result = ds.Tables[1].Select("CallId =" + _dr["Id"] + " ");
                            ticketsJarr = new JArray();
                            foreach (DataRow row in result)
                            {
                                ticketJobj = new JObject(new JProperty("Id", row["id"].ToString()),
                                    new JProperty("Subject", row["Subject"].ToString()),
                                    new JProperty("Body", row["Body"].ToString()),
                                    new JProperty("Categories", row["Categories"].ToString()),
                                    new JProperty("ColorCodes", row["ColorCodes"].ToString()),
                                    new JProperty("Number", row["Number"].ToString()));
                                ticketsJarr.Add(ticketJobj);
                            }
                            callHistoryObj.Add("Tickets", ticketsJarr);
                            callHistoryJarr.Add(callHistoryObj);
                        }
                        helper.CreateProperty("Success", "True");
                        helper.CreateProperty("Message", "Success");
                        helper.CreateProperty("CallHistory", callHistoryJarr);
                    }
                    else
                    {
                        helper.CreateProperty("Success", "True");
                        helper.CreateProperty("Message", "No Call History");
                        helper.CreateProperty("CallHistory", callHistoryJarr);
                    }
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty(UDC.Label.MESSAGE, ex.ToString());
                helper.CreateProperty(UDC.Label.SUCCESS, false);
                Logger.Error(ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject GetCallerDetails(String connection, string fromNumber,int agentId,string detailsObj,int mode,int accountId,string name,string email,string caller_id,string callerMobile)
        {

            try
            {
                Press3.DataAccessLayer.Caller agentObject = new Press3.DataAccessLayer.Caller(connection);
                DataSet ds = agentObject.GetCallerDetails(fromNumber, agentId, mode, detailsObj, accountId,name,email,caller_id,callerMobile);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty(UDC.Label.MESSAGE, ex.ToString());
                helper.CreateProperty(UDC.Label.SUCCESS, false);
                Logger.Error(ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject CallersManagement(String connection,UserDefinedClasses.Callers callsObj)
        {

            try
            {
                Press3.DataAccessLayer.Caller agentObject = new Press3.DataAccessLayer.Caller(connection);
                DataSet ds = agentObject.CallersManagement(callsObj);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty(UDC.Label.MESSAGE, ex.ToString());
                helper.CreateProperty(UDC.Label.SUCCESS, false);
                Logger.Error(ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject ManageCallerGroupsAndLabels(String connection, UserDefinedClasses.Callers callsObj)
        {

            try
            {
                Press3.DataAccessLayer.Caller agentObject = new Press3.DataAccessLayer.Caller(connection);
                DataSet ds = agentObject.ManageCallerGroupsAndLabels(callsObj);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty(UDC.Label.MESSAGE, ex.ToString());
                helper.CreateProperty(UDC.Label.SUCCESS, false);
                Logger.Error(ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject AddCallersToGroupsOrLabels(String connection, UserDefinedClasses.Callers callsObj, int sourcegroupId)
        {

            try
            {
                Press3.DataAccessLayer.Caller agentObject = new Press3.DataAccessLayer.Caller(connection);
                DataSet ds = agentObject.AddCallersToGroupsOrLabels(callsObj, sourcegroupId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty(UDC.Label.MESSAGE, ex.ToString());
                helper.CreateProperty(UDC.Label.SUCCESS, false);
                Logger.Error(ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject AddCallersThroughExcel(string connection, int accountId, int agentId, string filePath, string excelData, string isHeader)
        {
            try
            {
                JObject jObj = new JObject();
                jObj = JObject.Parse(excelData);
                String excelUploadPath = HttpContext.Current.Server.MapPath("~/CallerExcelUploads/");
                String extension = System.IO.Path.GetExtension(filePath);
                JArray sheetArray = new JArray(), columnsArray = new JArray();
                sheetArray = jObj.SelectToken("data") as JArray;
                columnsArray = jObj.SelectToken(@"data[0].columns") as JArray;
                DataTable table = new DataTable();
                table.Columns.Add("SheetName", typeof(string));
                table.Columns.Add("ColumnsCount", typeof(int));
                foreach (JObject _columnName in columnsArray)
                {
                    table.Columns.Add(_columnName.SelectToken("Label").ToString(), typeof(string));
                }

                foreach (JObject _sheet in sheetArray)
                {
                    object[] val = new object[columnsArray.Count + 2];
                    val[0] = _sheet.SelectToken("sheetname").ToString();
                    val[1] = _sheet.SelectToken("columnscount").ToString();
                    int rowNo = 2;
                    foreach (JObject _columnName in columnsArray)
                    {
                        val[rowNo] = _columnName.SelectToken("Column").ToString();
                        rowNo = rowNo + 1;
                    }
                    table.Rows.Add(val);
                }




                




                string excelOleDbConstring = "";
                OleDbConnection oleDbCon = default(OleDbConnection);
                oleDbCon = null;
                if (extension == ".xlsx")
                {
                    excelOleDbConstring = excelOleDbConstring + "provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + excelUploadPath + filePath + ";Persist Security Info=True; Extended Properties=\"Excel 12.0;HDR=" + isHeader + ";IMEX=1;\"";
                }
                else if (extension == ".xls")
                {
                    excelOleDbConstring = excelOleDbConstring + "provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + excelUploadPath + filePath + ";Persist Security Info=True; Extended Properties=\"Excel 8.0;HDR=" + isHeader + ";IMEX=1;\"";
                }

                Regex numericValidation = new Regex(@"^[0-9]*$");
                Regex alphanumericValidation = new Regex(@"^[A-Za-z0-9 ]+$");
                Regex alphaValidation = new Regex(@"^[a-zA-Z\s]+$");

                oleDbCon = new OleDbConnection(excelOleDbConstring);
                OleDbCommand oleCmdSelect = null;
                OleDbDataAdapter oleAdapter = null;
                DataSet dSet = null;
                DataTable resultantTable = new DataTable();
                resultantTable.Columns.Add("Name", typeof(string));
                resultantTable.Columns.Add("Mobile", typeof(string));
                resultantTable.Columns.Add("Email", typeof(string));
                resultantTable.Columns.Add("MetaData", typeof(string));

                //foreach (JObject _columnName in columnsArray)
                //{
                //    Tab.Columns.Add(_columnName.SelectToken("Label").ToString(), typeof(string));
                //}


                for (int k = 0; k <= table.Rows.Count - 1; k++)
                {
                    oleAdapter = null;
                    dSet = null;



                    oleCmdSelect = new OleDbCommand("SELECT   *  FROM [" + table.Rows[k]["sheetname"] + "$]", oleDbCon);
                    oleAdapter = new OleDbDataAdapter(oleCmdSelect);
                    dSet = new DataSet();
                    oleAdapter.Fill(dSet);

                  
                    DataTable dtab = new DataTable();

                    dtab = dSet.Tables[0];

                    dtab = RemoveEmptyRows(dtab);

                   

                    if (dtab.Rows.Count == 0)
                    {
                        helper.CreateProperty(UDC.Label.MESSAGE, "No Records found in the sheet..!");
                        helper.CreateProperty(UDC.Label.SUCCESS, false);
                        return helper.GetResponse();
                    }
                    else
                    {

                        if (dSet.Tables[0].Columns.Count >= 3)
                        {
                            var _with1 = dSet.Tables[0];

                            int test = dtab.Rows.Count;

                            foreach (DataRow _Row in dtab.Rows)
                            {
                                JObject jObjMetaData = new JObject();
                                string excelName = "", excelMobile = "", excelEmail = "";

                                foreach (JObject _columnDetails in columnsArray)
                                {
                                    string columnName = _columnDetails.SelectToken("Label").ToString().Trim();
                                    int columnNo = Convert.ToInt32(_columnDetails.SelectToken("Column").ToString().Trim());
                                    string columnType = _columnDetails.SelectToken("Type").ToString().Trim();
                                    string isMandatory = _columnDetails.SelectToken("Mandatory").ToString().Trim();
                                    int columnMaxChars = Convert.ToInt32(_columnDetails.SelectToken("MaxChars").ToString().Trim());
                                    string columnValue = string.Empty;

                                    if (columnNo == 0 && isMandatory.ToLower() == "yes")
                                    {
                                        helper.CreateProperty(UDC.Label.MESSAGE, "Select column for " + columnName);
                                        helper.CreateProperty(UDC.Label.SUCCESS, false);
                                        return helper.GetResponse();
                                    }

                                    if (columnNo > 0)
                                    {
                                        columnValue = _Row[columnNo - 1].ToString().Trim();
                                    }
                                    else
                                    {
                                        columnValue = string.Empty;
                                    }
                                    if (columnValue == "" && isMandatory.ToLower() == "yes")
                                    {
                                        helper.CreateProperty(UDC.Label.MESSAGE, columnName + " is mandatory");
                                        helper.CreateProperty(UDC.Label.SUCCESS, false);
                                        return helper.GetResponse();
                                    }
                                    else
                                    {
                                        if (columnName == "Name")
                                        {
                                            if (isMandatory.ToLower() == "yes" && columnValue == "")
                                            {
                                                helper.CreateProperty(UDC.Label.MESSAGE, "Name is mandatory");
                                                helper.CreateProperty(UDC.Label.SUCCESS, false);
                                                return helper.GetResponse();
                                            }
                                            else if (isMandatory.ToLower() == "no" && columnValue == "")
                                            {
                                                excelName = columnValue;
                                            }
                                            else
                                            {
                                                if (columnValue.Length > columnMaxChars)
                                                {
                                                    helper.CreateProperty(UDC.Label.MESSAGE, "Name should not exceed " + columnMaxChars + " characters" + ". Name is - " + columnValue);
                                                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                                                    return helper.GetResponse();
                                                }
                                                //else if (!alphanumericValidation.IsMatch(columnValue))
                                                //{
                                                //    helper.CreateProperty(UDC.Label.MESSAGE, "Name should be alpha numeric");
                                                //    helper.CreateProperty(UDC.Label.SUCCESS, false);
                                                //    return helper.GetResponse();
                                                //}
                                                else
                                                {
                                                    excelName = columnValue;
                                                }
                                            }
                                        }
                                        else if (columnName == "Mobile")
                                        {
                                            if (isMandatory.ToLower() == "yes" && columnValue == "")
                                            {
                                                helper.CreateProperty(UDC.Label.MESSAGE, "Mobile is mandatory");
                                                helper.CreateProperty(UDC.Label.SUCCESS, false);
                                                return helper.GetResponse();
                                            }
                                            else if (isMandatory.ToLower() == "no" && columnValue == "")
                                            {
                                                excelMobile = columnValue;
                                            }
                                            else
                                            {
                                                if (columnValue.Length > columnMaxChars)
                                                {
                                                    helper.CreateProperty(UDC.Label.MESSAGE, "Mobile should not exceed " + columnMaxChars + " characters" + ". Mob No is - " + columnValue);
                                                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                                                    return helper.GetResponse();
                                                }
                                                else if (!numericValidation.IsMatch(columnValue))
                                                {
                                                    helper.CreateProperty(UDC.Label.MESSAGE, "Mobile Number should be Numeric"  );
                                                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                                                    return helper.GetResponse();
                                                }
                                                else
                                                {
                                                    excelMobile = columnValue;
                                                }
                                            }
                                        }
                                        else if (columnName == "Email")
                                        {
                                            bool emailValid = true;
                                            if (columnValue != "")
                                            {
                                                emailValid = IsValid(columnValue);
                                            }
                                            if (isMandatory.ToLower() == "yes" && columnValue == "")
                                            {
                                                helper.CreateProperty(UDC.Label.MESSAGE, "Email is mandatory");
                                                helper.CreateProperty(UDC.Label.SUCCESS, false);
                                                return helper.GetResponse();
                                            }
                                            else if (isMandatory.ToLower() == "no" && columnValue == "")
                                            {
                                                excelEmail = columnValue;
                                            }
                                            else
                                            {
                                                if (columnValue.Length > columnMaxChars)
                                                {
                                                    helper.CreateProperty(UDC.Label.MESSAGE, "Email should not exceed " + columnMaxChars + " characters" + ". Email Id is - " + columnValue);
                                                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                                                    return helper.GetResponse();
                                                }
                                                else if (!emailValid)
                                                {
                                                    helper.CreateProperty(UDC.Label.MESSAGE, "Invalid Email" + ". Email Is - " + columnValue);
                                                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                                                    return helper.GetResponse();
                                                }
                                                else
                                                {
                                                    excelEmail = columnValue;
                                                }
                                            }
                                        }
                                        else
                                        {
                                            if (columnNo > 0)
                                            {
                                                if (columnType.ToLower() == "numeric")
                                                {
                                                    if (isMandatory.ToLower() == "yes" && columnValue == "")
                                                    {
                                                        helper.CreateProperty(UDC.Label.MESSAGE, columnName + " is mandatory");
                                                        helper.CreateProperty(UDC.Label.SUCCESS, false);
                                                        return helper.GetResponse();
                                                    }
                                                    else if (isMandatory.ToLower() == "no" && columnValue == "")
                                                    {
                                                        jObjMetaData.Add(new JProperty(columnName, columnValue));
                                                    }
                                                    else
                                                    {
                                                        if (columnValue.Length > columnMaxChars)
                                                        {
                                                            helper.CreateProperty(UDC.Label.MESSAGE, columnName + " should not exceed " + columnMaxChars + " characters");
                                                            helper.CreateProperty(UDC.Label.SUCCESS, false);
                                                            return helper.GetResponse();
                                                        }
                                                        else if (!numericValidation.IsMatch(columnValue))
                                                        {
                                                            helper.CreateProperty(UDC.Label.MESSAGE, columnName + " should be numeric");
                                                            helper.CreateProperty(UDC.Label.SUCCESS, false);
                                                            return helper.GetResponse();
                                                        }
                                                        else
                                                        {
                                                            jObjMetaData.Add(new JProperty(columnName, columnValue));
                                                        }
                                                    }
                                                }
                                                else if (columnType.ToLower() == "alphabets")
                                                {
                                                    if (isMandatory.ToLower() == "yes" && columnValue == "")
                                                    {
                                                        helper.CreateProperty(UDC.Label.MESSAGE, columnName + " is mandatory");
                                                        helper.CreateProperty(UDC.Label.SUCCESS, false);
                                                        return helper.GetResponse();
                                                    }
                                                    else if (isMandatory.ToLower() == "no" && columnValue == "")
                                                    {
                                                        jObjMetaData.Add(new JProperty(columnName, columnValue));
                                                    }
                                                    else
                                                    {
                                                        if (columnValue.Length > columnMaxChars)
                                                        {
                                                            helper.CreateProperty(UDC.Label.MESSAGE, columnName + " should not exceed " + columnMaxChars + " characters");
                                                            helper.CreateProperty(UDC.Label.SUCCESS, false);
                                                            return helper.GetResponse();
                                                        }
                                                        else if (!alphaValidation.IsMatch(columnValue))
                                                        {
                                                            helper.CreateProperty(UDC.Label.MESSAGE, columnName + " should contain only alphabets");
                                                            helper.CreateProperty(UDC.Label.SUCCESS, false);
                                                            return helper.GetResponse();
                                                        }
                                                        else
                                                        {
                                                            jObjMetaData.Add(new JProperty(columnName, columnValue));
                                                        }
                                                    }
                                                }
                                                else if (columnType.ToLower() == "alphanumeric")
                                                {
                                                    if (isMandatory.ToLower() == "yes" && columnValue == "")
                                                    {
                                                        helper.CreateProperty(UDC.Label.MESSAGE, columnName + " is mandatory");
                                                        helper.CreateProperty(UDC.Label.SUCCESS, false);
                                                        return helper.GetResponse();
                                                    }
                                                    else if (isMandatory.ToLower() == "no" && columnValue == "")
                                                    {
                                                        jObjMetaData.Add(new JProperty(columnName, columnValue));
                                                    }
                                                    else
                                                    {
                                                        if (columnValue.Length > columnMaxChars)
                                                        {
                                                            helper.CreateProperty(UDC.Label.MESSAGE, columnName + " should not exceed " + columnMaxChars + " characters");
                                                            helper.CreateProperty(UDC.Label.SUCCESS, false);
                                                            return helper.GetResponse();
                                                        }
                                                        else if (!alphanumericValidation.IsMatch(columnValue))
                                                        {
                                                            helper.CreateProperty(UDC.Label.MESSAGE, columnName + " should be alpha numeric");
                                                            helper.CreateProperty(UDC.Label.SUCCESS, false);
                                                            return helper.GetResponse();
                                                        }
                                                        else
                                                        {
                                                            jObjMetaData.Add(new JProperty(columnName, columnValue));
                                                        }
                                                    }
                                                }
                                                else if (columnType.ToLower() == "null")
                                                {

                                                    if (isMandatory.ToLower() == "no" && columnValue == "")
                                                    {
                                                        jObjMetaData.Add(new JProperty(columnName, columnValue));
                                                    }
                                                    else
                                                    {
                                                        if (columnValue.Length > columnMaxChars)
                                                        {
                                                            helper.CreateProperty(UDC.Label.MESSAGE, columnName + " should not exceed " + columnMaxChars + " characters");
                                                            helper.CreateProperty(UDC.Label.SUCCESS, false);
                                                            return helper.GetResponse();
                                                        }
                                                        else
                                                        {
                                                            jObjMetaData.Add(new JProperty(columnName, columnValue));
                                                        }
                                                    }
                                                }
                                                else if (columnType.ToLower() == "unicode")
                                                {

                                                    if (isMandatory.ToLower() == "no" && columnValue == "")
                                                    {
                                                        jObjMetaData.Add(new JProperty(columnName, columnValue));
                                                    }
                                                    else
                                                    {
                                                        if (columnValue.Length > columnMaxChars)
                                                        {
                                                            helper.CreateProperty(UDC.Label.MESSAGE, columnName + " should not exceed " + columnMaxChars + " characters");
                                                            helper.CreateProperty(UDC.Label.SUCCESS, false);
                                                            return helper.GetResponse();
                                                        }
                                                        else
                                                        {
                                                            jObjMetaData.Add(new JProperty(columnName, columnValue));
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                resultantTable.Rows.Add(excelName, excelMobile, excelEmail, jObjMetaData.ToString());
                            }
                        }
                    }
                }

                Press3.DataAccessLayer.Caller callerObject = new Press3.DataAccessLayer.Caller(connection);
                DataSet ds = callerObject.AddCallersThroughExcel(accountId, agentId, resultantTable);
                
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty(UDC.Label.MESSAGE, ex.ToString());
                helper.CreateProperty(UDC.Label.SUCCESS, false);
                Logger.Error(ex.ToString());
            }
            return helper.GetResponse();
        }

        private DataTable RemoveEmptyRows(DataTable source)
        {


            for (int i = source.Rows.Count - 1; i >= 0; i += -1)
            {
                int testflag = 0;
                DataRow row = source.Rows[i];
                for (int j = source.Columns.Count - 1; j >= 0;j+=-1)
                {
                    if(!(string.IsNullOrEmpty(source.Rows[i][j].ToString())))
                    {
                        testflag = 1;
                        break;
                    }

                }
                if (testflag==0)
                {
                    source.Rows.Remove(row);
                }

            }

            for (int k = source.Columns.Count - 1; k >= 0; k--)
            {
                int testflagtwo = 0;

                DataColumn col = source.Columns[k];

                for (int m = source.Rows.Count - 1; m >= 0; m--)
                {

                    if (!(string.IsNullOrEmpty(source.Rows[m][k].ToString())))
                    {
                        testflagtwo = 1;
                        break;
                    }

                }
                if (testflagtwo == 0)
                {
                    source.Columns.Remove(col);
                }

            }


                return source;
        }
        public JObject DeleteCallersManagement(String connection, UserDefinedClasses.Callers callsObj)
        {

            try
            {
                Press3.DataAccessLayer.Caller agentObject = new Press3.DataAccessLayer.Caller(connection);
                DataSet ds = agentObject.DeleteCallersManagement(callsObj);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty(UDC.Label.MESSAGE, ex.ToString());
                helper.CreateProperty(UDC.Label.SUCCESS, false);
                Logger.Error(ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject EditLableAndGroups(String connection, UserDefinedClasses.Callers callsObj)
        {

            try
            {
                Press3.DataAccessLayer.Caller agentObject = new Press3.DataAccessLayer.Caller(connection);
                DataSet ds = agentObject.EditLableAndGroups(callsObj);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                helper.CreateProperty(UDC.Label.MESSAGE, ex.ToString());
                helper.CreateProperty(UDC.Label.SUCCESS, false);
                Logger.Error(ex.ToString());
            }
            return helper.GetResponse();
        }
        public bool IsValid(string emailaddress)
        {
            try
            {
                MailAddress m = new MailAddress(emailaddress);

                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }
    }
}
