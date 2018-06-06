using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using Press3.BusinessRulesLayer;
using Press3.Utilities;
using Press3.UI.CommonClasses;
using Newtonsoft.Json.Linq;
using NPOI.SS.UserModel;
using NPOI.HSSF.UserModel;
using NPOI.XSSF.UserModel;
using System.IO;

namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for ScoreCardExcelUpload
    /// </summary>
    public class ScoreCardExcelUpload : IHttpHandler, IRequiresSessionState
    {
        int accountId = 0;
        int header = 0;
        public void ProcessRequest(HttpContext context)
        {

            JObject jObj = new JObject();
            try
            {
                if (context.Session["accountId"] != null)
                {
                    accountId = Convert.ToInt32(context.Session["accountId"]);
                }
                else
                {
                    HttpContext.Current.Response.StatusCode = 401;
                    return;
                }


                if (context.Request.Files.Count > 0)
                {
                    System.Web.HttpPostedFile file = context.Request.Files[0];
                    string fileName = file.FileName.Substring(0, file.FileName.LastIndexOf('.'));
                    string extension = Path.GetExtension(file.FileName);
                    header = Convert.ToInt16(context.Request.QueryString["header"]);
                    if (!ValidateFileName(fileName))
                    {
                        jObj = new JObject(new JProperty("Status", false), new JProperty("Message", "File name should not contain  i) Morethan one dot ii) Comma ."));
                        context.Response.Write(jObj);
                        return;
                    }

                    if (extension != ".xlsx" && extension != ".xls")
                    {
                        jObj = new JObject(new JProperty("Status", false),
                                         new JProperty("Message", "Invalid file.Please upload xlsx or xls files" + extension));
                        context.Response.Write(jObj);
                        return;
                    }

                    if (!(file.ContentType == "application/vnd.ms-excel") && file.ContentType == "application/excel" && file.ContentType == "application/x-msexcel")
                    {
                        jObj = new JObject(new JProperty("Success", false),
                                         new JProperty("Message", "Invalid excel file.Please check once"));
                        context.Response.Write(jObj);
                        return;
                    }

                    string timeSpan = DateTime.Now.ToString("ddMMyyhhmmss");
                    string folderPath = "", filePath = "";
                    folderPath = context.Server.MapPath("~/ScorecardFileUpload/");
                    // floderName = "ScriptFileUpload";
                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }

                    filePath = folderPath + fileName + "_" + timeSpan + extension;
                    file.SaveAs(filePath);

                    JArray jArr = new JArray();
                    jArr = ReadExcelData(filePath, extension);
                    if (jArr == null || jArr.Count() == 0)
                    {
                        jObj = new JObject(new JProperty("Success", false),
                                        new JProperty("Message", "Selected excel file is empty"));
                    }
                    else
                    {
                        if (jArr[0].SelectToken("Success").ToString() == "false")
                        {
                            jObj = new JObject(new JProperty("Success", false),
                                        new JProperty("Message", jArr[0].SelectToken("Message").ToString()));

                        }
                        else
                        {
                            jObj = new JObject(new JProperty("Success", true),
                                new JProperty("FilePath", fileName + "_" + timeSpan + extension),
                                new JProperty("FileName", fileName + extension),
                                new JProperty("ExcelSheets", jArr));
                        }
                    }
                }
                else
                {
                    jObj = new JObject(new JProperty("Success", false),
                                     new JProperty("Message", "No file.Please select atleast one file "));
                }
            }
            catch (Exception ex)
            {
                jObj = new JObject(new JProperty("Success", false),
                                   new JProperty("Message", "Something went wrong..Please upload a valid excel file"));
                Logger.Error("Exception in ScoreCardExcelUpload.ashx " + ex.ToString());

            }

            context.Response.Write(jObj);
            return;


        }


        private bool ValidateFileName(string fileName)
        {
            bool isValid = true;
            try
            {
                if (fileName.Contains("..") || fileName.Contains(',') || fileName.Contains('.'))
                    isValid = false;
                else
                    isValid = true;

            }
            catch (Exception ex)
            {
                isValid = false;
                Logger.Error("Exception in ScoreCardExcelUpload.ashx " + ex.ToString());
            }

            return isValid;
        }
        public JArray ReadExcelData(string file, string fileExt)
        {
            Dictionary<string, XSSFSheet> sheets = new Dictionary<string, XSSFSheet>();
            string[] columns = { };
            string sheetName = "";
            ISheet _Sheet = null;
            int columnsCount = 0;
            string columnName = "";
            JArray jArr = new JArray();
            JArray nohearders = new JArray();
            JArray headersArr = new JArray();
            if (fileExt == ".xls")
            {
                HSSFWorkbook workBook = new HSSFWorkbook();
                using (FileStream fileStream = new FileStream(file, FileMode.Open, FileAccess.Read))
                {
                    workBook = new HSSFWorkbook(fileStream);
                    for (int i = 0; i <= workBook.NumberOfSheets - 1; i++)
                    {
                        if (i == 0)
                        {
                            sheetName = workBook[i].SheetName;
                            _Sheet = workBook.GetSheet(sheetName);
                            columnName = "";
                            if (_Sheet.PhysicalNumberOfRows < 2 && header == 1)
                            {
                                jArr.Add(new JObject(new JProperty("Success", "false"),
                                                       new JProperty("Message", "No data in the columns")));
                                break;
                            }
                            if (_Sheet.PhysicalNumberOfRows != 0)
                            {
                                if (_Sheet.GetRow(0) == null)
                                {
                                    columnsCount = 0;
                                }
                                else
                                {
                                    columnsCount = _Sheet.GetRow(0).PhysicalNumberOfCells;
                                }

                                if (columnsCount != 0)
                                {
                                    for (int j = 0; j <= columnsCount - 1; j++)
                                    {
                                        columnName = _Sheet.GetRow(0).Cells[j].ToString();
                                        headersArr.Add(new JObject(new JProperty("header", columnName)));
                                    }


                                    jArr.Add(new JObject(new JProperty("SheetName", sheetName),
                                                        new JProperty("ColumnsCount", columnsCount),
                                                        new JProperty("Header", headersArr)));
                                }

                            }
                        }
                    }
                }
            }
            else
            {
                XSSFWorkbook workBook = new XSSFWorkbook();
                using (FileStream fileStream = new FileStream(file, FileMode.Open, FileAccess.Read))
                {
                    workBook = new XSSFWorkbook(fileStream);



                    for (int i = 0; i <= workBook.NumberOfSheets - 1; i++)
                    {
                        if (i == 0)
                        {
                            sheetName = workBook[i].SheetName;
                            _Sheet = workBook.GetSheet(sheetName);
                            columnName = "";


                            if (_Sheet.PhysicalNumberOfRows < 2 && header == 1)
                            {
                                jArr = new JArray();
                                jArr.Add(new JObject(new JProperty("Success", "false"),
                                                       new JProperty("Message", "No data in the columns")));
                                break;
                            }
                            if (_Sheet.PhysicalNumberOfRows != 0)
                            {
                                if (_Sheet.GetRow(0) == null)
                                {
                                    columnsCount = 0;
                                }
                                else
                                {
                                    columnsCount = _Sheet.GetRow(0).PhysicalNumberOfCells;
                                }

                                if (columnsCount != 0)
                                {
                                    for (int j = 0; j <= columnsCount - 1; j++)
                                    {

                                        columnName = _Sheet.GetRow(0).Cells[j].ToString();
                                        headersArr.Add(new JObject(new JProperty("header", columnName)));

                                    }
                                    jArr.Add(new JObject(new JProperty("SheetName", sheetName),
                                                        new JProperty("ColumnsCount", columnsCount),
                                                        new JProperty("Header", headersArr), new JProperty("Success", "true")));

                                }


                            }
                        }
                    }
                }
            }

            return jArr;
        }




        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}