using Newtonsoft.Json.Linq;
using NPOI.SS.UserModel;
using NPOI.HSSF.UserModel;
using NPOI.XSSF.UserModel;
using Press3.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using System.Data;
using System.Data.OleDb;

namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for CallersUpload
    /// </summary>
    public class CallersUpload : IHttpHandler, IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            JObject jObj = new JObject();
            try
            {
                if (context.Session["AccountId"] == null)
                {
                    jObj = new JObject(new JProperty("Success", false), new JProperty("Message", "Session expired."), new JProperty("StatusCode", 401));
                    context.Response.Write(jObj);
                    return;
                }
                if (context.Request.Files.Count > 0)
                {
                    System.Web.HttpPostedFile file = context.Request.Files[0];
                    string fileName = file.FileName.Substring(0, file.FileName.LastIndexOf('.'));
                    string extension = Path.GetExtension(file.FileName);

                    if (!ValidateFileName(fileName))
                    {
                        jObj = new JObject(new JProperty("Success", false), new JProperty("Message", "File name should not contain  i) Morethan one dot ii) Comma ."));
                        context.Response.Write(jObj);
                        return;
                    }

                    if (extension != ".xlsx" && extension != ".xls")
                    {
                        jObj = new JObject(new JProperty("Success", false),
                                         new JProperty("Message", "Invalid file. Please upload .xlsx or .xls files"));
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

                    folderPath = HttpContext.Current.Server.MapPath("~/CallerExcelUploads/");
                    // floderName = "ScriptFileUpload";
                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }
                    folderPath = "";
                    folderPath = context.Server.MapPath("~/CallerExcelUploads/");
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


                        jObj = new JObject(new JProperty("Success", true),
                            new JProperty("FilePath", fileName + "_" + timeSpan + extension),
                            new JProperty("FileName", fileName + extension),
                            new JProperty("ExcelSheets", jArr));
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
                Logger.Error("Exception in ExcelUpload.ashx " + ex.ToString());

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
                Logger.Error("Exception in ExcelUpload.ashx " + ex.ToString());
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
                        sheetName = workBook[i].SheetName;
                        _Sheet = workBook.GetSheet(sheetName);

                        for (int j = 0; j < _Sheet.PhysicalNumberOfRows; j++)
                        {
                            var row = _Sheet.GetRow(j);
                            if (row == null)
                            {
                                // HSSFCell cell7 = (HSSFCell)row.CreateCell(0);
                                // cell7.SetCellValue(" ");
                                // _Sheet.RemoveRow(row);
                                _Sheet.ShiftRows(j + 1, _Sheet.LastRowNum, -1);
                            }




                            

                           

                        }

                        columnName = "";
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
            else
            {
                XSSFWorkbook workBook = new XSSFWorkbook();
                using (FileStream fileStream = new FileStream(file, FileMode.Open, FileAccess.Read))
                {
                    workBook = new XSSFWorkbook(fileStream);
                    for (int i = 0; i <= workBook.NumberOfSheets - 1; i++)
                    {
                        sheetName = workBook[i].SheetName;
                        _Sheet = workBook.GetSheet(sheetName);

                        int loopcount = (_Sheet.LastRowNum - _Sheet.PhysicalNumberOfRows);

                        for (int j = 0; j <= loopcount; j++)
                        {
                            var row = _Sheet.GetRow(0);
                            if (row == null)
                            {
                               // HSSFCell cell7 = (HSSFCell)row.CreateCell(0);
                               // cell7.SetCellValue(" ");
                               // _Sheet.RemoveRow(row);

                                int no =_Sheet.FirstRowNum;
                                int lno = _Sheet.LastRowNum;

                              
                                 //_Sheet.RemoveRow(row);

                                _Sheet.ShiftRows(no, lno, -1);
                            }

                        }



                        columnName = "";
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