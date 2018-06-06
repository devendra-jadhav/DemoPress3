using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using Press3.UI.CommonClasses;
using System.IO;
using NPOI.XSSF.UserModel;
using Press3.Utilities;

namespace Press3.UI
{
    public partial class CallHistory : System.Web.UI.Page
    {
        public int accountId = 0;
        public int roleId = 0;
        public int agentId = 0;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["AccountId"] == null)
            {
                Response.Redirect("/Login.aspx?message=Session expired");
                return;
            }
            else
            {
                accountId = Convert.ToInt32(Session["AccountId"]);
                roleId = Convert.ToInt32(Session["RoleId"]);
                agentId = Convert.ToInt32(Session["AgentId"]);
            }
        }
        public void DownloadExcelReports_Click(object sender, EventArgs e)
        {
            UserDefinedClasses.CallHistoryDetails callHistoryDetailsObj = new UserDefinedClasses.CallHistoryDetails();
            callHistoryDetailsObj.AccountId = accountId;
            callHistoryDetailsObj.Date = hdnDate.Value != null ? hdnDate.Value : "";
            DataSet responseDataSet = new DataSet();
            if (Convert.ToInt32(Session["RoleId"]) == 1)
            {
                callHistoryDetailsObj.AgentId = agentId;
            }
            else
            {
                callHistoryDetailsObj.AgentId = hdnAgent.Value != null ? Convert.ToInt32(hdnAgent.Value) : 0;
            }
            callHistoryDetailsObj.SessionAgentId = agentId;
            callHistoryDetailsObj.RoleId = roleId;
            callHistoryDetailsObj.CallType = hdnCallType.Value != null ? Convert.ToInt32(hdnCallType.Value) : 0;
            callHistoryDetailsObj.SkillGroupId = hdnRingGroup.Value != null ? Convert.ToInt32(hdnRingGroup.Value) : 0;
            callHistoryDetailsObj.SkillId = hdnSkill.Value != null ? Convert.ToInt32(hdnSkill.Value) : 0;
            callHistoryDetailsObj.FromDate = hdnFromDate.Value;
            callHistoryDetailsObj.ToDate = hdnToDate.Value;
            callHistoryDetailsObj.Date = hdnDate.Value;
            callHistoryDetailsObj.PageSize = hdnPageSize.Value != null ? Convert.ToInt32(hdnPageSize.Value) : 0;
            callHistoryDetailsObj.PageNumber = hdnPageNumber.Value != null ? Convert.ToInt32(hdnPageNumber.Value) : 0;
            callHistoryDetailsObj.CallId = hdnCallId.Value != null ? Convert.ToInt32(hdnCallId.Value) : 0;
            callHistoryDetailsObj.StudioId = hdnStudioId.Value != null ? Convert.ToInt32(hdnStudioId.Value) : 0;
            callHistoryDetailsObj.CallDirection = hdnCallDirection.Value != null ? Convert.ToInt32(hdnCallDirection.Value) : 0;
            callHistoryDetailsObj.Exceldownload = 1;
            Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
            responseDataSet = callsObject.DownloadCallHistory(MyConfig.MyConnectionString, callHistoryDetailsObj);
            
            if(responseDataSet != null)
            {
                if (responseDataSet.Tables.Count > 0)
                {
                        string file_name = "";
                        try
                        {
                            var book = new XSSFWorkbook();
                            var sheet = book.CreateSheet("Sheet1");
                            Logger.Info("DownloadExcelReports_Click started 1");
                            dynamic headerRow = sheet.CreateRow(0);


                            var style = book.CreateCellStyle();
                            var font = book.CreateFont();


                            // font.FontHeightInPoints = 10;

                            font.IsBold = true;

                            style.SetFont(font);


                            headerRow.CreateCell(0).SetCellValue("Time Stamp");
                            headerRow.CreateCell(1).SetCellValue("Call Type");
                            headerRow.CreateCell(2).SetCellValue("Caller Details");
                            headerRow.CreateCell(3).SetCellValue("SkillGroup");
                            headerRow.CreateCell(4).SetCellValue("Skill Selection Flow");
                            headerRow.CreateCell(5).SetCellValue("Agent");
                            headerRow.CreateCell(6).SetCellValue("Wait Time(sec)");
                            headerRow.CreateCell(7).SetCellValue("Duration(sec)");
                            headerRow.CreateCell(8).SetCellValue("Hold Time(sec)");
                            headerRow.CreateCell(9).SetCellValue(" Ivr Studio");
                            
                            //headerRow.getCell(0).setCellStyle(style);
                           

                            if (responseDataSet.Tables[1].Rows.Count > 0)
                            {
                                var _with1 = responseDataSet.Tables[0];
                                for (int i = 0; i <= _with1.Rows.Count - 1; i++)  // _with1.Rows.Count - 1
                                {
                                    dynamic row = sheet.CreateRow(i + 1);
                                    row.CreateCell(0).SetCellValue(_with1.Rows[i]["DateTime"].ToString());
                                    row.CreateCell(1).SetCellValue(_with1.Rows[i]["CallType"].ToString()); 
                                    row.CreateCell(2).SetCellValue(_with1.Rows[i]["CallerDetails"].ToString() + "  " + _with1.Rows[i]["Source"].ToString()); 
                                    row.CreateCell(3).SetCellValue(_with1.Rows[i]["RingGroup"].ToString());
                                    row.CreateCell(4).SetCellValue(_with1.Rows[i]["Skills"].ToString()); 
                                    row.CreateCell(5).SetCellValue(_with1.Rows[i]["Agent"].ToString()); 
                                    row.CreateCell(6).SetCellValue(_with1.Rows[i]["WaitTime"].ToString()); 
                                    row.CreateCell(7).SetCellValue(_with1.Rows[i]["Duration"].ToString());
                                    row.CreateCell(8).SetCellValue(_with1.Rows[i]["HoldTime"].ToString()); 
                                    row.CreateCell(9).SetCellValue(_with1.Rows[i]["Ivr_Studio"].ToString());
                                }
                            }

                            string folderPath = "";
                            folderPath = HttpContext.Current.Server.MapPath("~/CallHistory/");
                            // floderName = "ScriptFileUpload";
                            if (!Directory.Exists(folderPath))
                            {
                                Directory.CreateDirectory(folderPath);
                            }

                            string path = System.Web.HttpContext.Current.Server.MapPath("~");
                            file_name = "CallHistory_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + ".xlsx";
                            FileStream exportData = new FileStream(path + "/CallHistory/" + file_name, FileMode.CreateNew);
                            book.Write(exportData);
                            HttpContext.Current.Response.Clear();
                            HttpContext.Current.Response.ClearHeaders();
                            HttpContext.Current.Response.ContentType = "application/vnd.ms-excel";
                            HttpContext.Current.Response.AddHeader("Content-Disposition", string.Format("attachment;filename={0}", file_name));
                            System.IO.FileInfo Dfile = new System.IO.FileInfo(path + "/CallHistory/" + file_name);
                            HttpContext.Current.Response.WriteFile(Dfile.FullName);
                            exportData.Close();
                            HttpContext.Current.Response.Flush();
                            System.IO.File.Delete(path + "/CallHistory/" + file_name);
                            HttpContext.Current.Response.End();

                        }
                        catch (Exception ex)
                        {
                            Logger.Info("DownloadExcelReports_Click " + ex.ToString());
                        }
                }
            }
        }






        public void DownloadOutBoundExcelReports_Click(object sender, EventArgs e)
        {
            UserDefinedClasses.CallHistoryDetails callHistoryDetailsObj = new UserDefinedClasses.CallHistoryDetails();
            callHistoryDetailsObj.AccountId = accountId;
            callHistoryDetailsObj.Date = hdnDate.Value != null ? hdnDate.Value : "";
            DataSet responseDataSet = new DataSet();
            //if (Convert.ToInt32(Session["RoleId"]) == 1)
            //{
            //    callHistoryDetailsObj.AgentId = agentId;
            //}
            //else
            //{
                callHistoryDetailsObj.AgentId = hdnAgent.Value != null ? Convert.ToInt32(hdnAgent.Value) : 0;
           // }
            callHistoryDetailsObj.CallType = hdnCallType.Value != null ? Convert.ToInt32(hdnCallType.Value) : 0;
          
            callHistoryDetailsObj.FromDate = hdnFromDate.Value;
            callHistoryDetailsObj.ToDate = hdnToDate.Value;
            callHistoryDetailsObj.Date = hdnDate.Value;
            callHistoryDetailsObj.Exceldownload = 1;
            callHistoryDetailsObj.PageSize = hdnPageSize.Value != null ? Convert.ToInt32(hdnPageSize.Value) : 0;
            callHistoryDetailsObj.PageNumber = hdnPageNumber.Value != null ? Convert.ToInt32(hdnPageNumber.Value) : 0;
            Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
            responseDataSet = callsObject.DownloadOutBoundCallHistory(MyConfig.MyConnectionString, callHistoryDetailsObj);

            if (responseDataSet != null)
            {
                if (responseDataSet.Tables.Count > 0)
                {
                    string file_name = "";
                    try
                    {
                        var book = new XSSFWorkbook();
                        var sheet = book.CreateSheet("Sheet1");
                        Logger.Info("DownloadOutBoundExcelReports_Click started 1");
                        dynamic headerRow = sheet.CreateRow(0);


                        var style = book.CreateCellStyle();
                        var font = book.CreateFont();


                        // font.FontHeightInPoints = 10;

                        font.IsBold = true;

                        style.SetFont(font);

                        headerRow.CreateCell(0).SetCellValue("Time Stamp");
                        headerRow.CreateCell(1).SetCellValue("From Number");
                        headerRow.CreateCell(2).SetCellValue("To Number");
                        headerRow.CreateCell(3).SetCellValue("Agent Name");
                        headerRow.CreateCell(4).SetCellValue("Access Type");
                        headerRow.CreateCell(5).SetCellValue("Ring Time");
                        headerRow.CreateCell(6).SetCellValue("AnswerTime");
                        headerRow.CreateCell(7).SetCellValue("EndTime");
                        headerRow.CreateCell(8).SetCellValue("Duration (Sec)");
                        headerRow.CreateCell(9).SetCellValue("EndReason");
                        headerRow.CreateCell(10).SetCellValue("Recording");




                        //headerRow.getCell(0).setCellStyle(style);


                        if (responseDataSet.Tables[1].Rows.Count > 0)
                        {
                            var _with1 = responseDataSet.Tables[0];
                            for (int i = 0; i <= _with1.Rows.Count - 1; i++)  // _with1.Rows.Count - 1
                            {
                                dynamic row = sheet.CreateRow(i + 1);
                                for (int c = 0; c <= responseDataSet.Tables[0].Columns.Count - 1; c++)
                                {

                                    switch (c)
                                    {

                                        case 0: row.CreateCell(c).SetCellValue(_with1.Rows[i]["TimeStamp"].ToString()); break;
                                        case 1: row.CreateCell(c).SetCellValue(_with1.Rows[i]["FromNumber"].ToString()); break;
                                        case 2: row.CreateCell(c).SetCellValue(_with1.Rows[i]["ToNumber"].ToString()); break;
                                        case 3: row.CreateCell(c).SetCellValue(_with1.Rows[i]["AgentName"].ToString()); break;
                                        case 4: row.CreateCell(c).SetCellValue(_with1.Rows[i]["AccessType"].ToString()); break;
                                        case 5: row.CreateCell(c).SetCellValue(_with1.Rows[i]["RingTime"].ToString()); break;
                                        case 6: row.CreateCell(c).SetCellValue(_with1.Rows[i]["AnswerTime"].ToString()); break;
                                        case 7: row.CreateCell(c).SetCellValue(_with1.Rows[i]["EndTime"].ToString()); break;
                                        case 8: row.CreateCell(c).SetCellValue(_with1.Rows[i]["Duration"].ToString()); break;
                                        case 9: row.CreateCell(c).SetCellValue(_with1.Rows[i]["EndReason"].ToString()); break;
                                        case 10: row.CreateCell(c).SetCellValue(_with1.Rows[i]["Recording"].ToString()); break;
                                    }


                                }
                            }
                        }
                        string path = System.Web.HttpContext.Current.Server.MapPath("~");
                        file_name = "CallHistory_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + ".xlsx";
                        FileStream exportData = new FileStream(path + "/CallHistory/" + file_name, FileMode.CreateNew);
                        book.Write(exportData);
                        HttpContext.Current.Response.Clear();
                        HttpContext.Current.Response.ClearHeaders();
                        HttpContext.Current.Response.ContentType = "application/vnd.ms-excel";
                        HttpContext.Current.Response.AddHeader("Content-Disposition", string.Format("attachment;filename={0}", file_name));
                        System.IO.FileInfo Dfile = new System.IO.FileInfo(path + "/CallHistory/" + file_name);
                        HttpContext.Current.Response.WriteFile(Dfile.FullName);
                        exportData.Close();
                        HttpContext.Current.Response.Flush();
                        System.IO.File.Delete(path + "/CallHistory/" + file_name);
                        HttpContext.Current.Response.End();

                    }
                    catch (Exception ex)
                    {
                        Logger.Info("DownloadExcelReports_Click " + ex.ToString());
                    }
                }
            }
        }

        public void Download_Reports_Click(object sender, EventArgs e)
        {
            UserDefinedClasses.CallHistoryDetails callHistoryDetailsObj = new UserDefinedClasses.CallHistoryDetails();
            callHistoryDetailsObj.AccountId = accountId;
            DataSet responseDataSet = new DataSet();
            callHistoryDetailsObj.ConferenceCallTypeId = hdnCallsType.Value != null ? hdnCallsType.Value : "";
            callHistoryDetailsObj.CallId = hdn_TC_CallId.Value != null ? Convert.ToInt32(hdn_TC_CallId.Value) : 0;
            Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
            responseDataSet = callsObject.DownloadTransferAndConferenceCallHistory(MyConfig.MyConnectionString, callHistoryDetailsObj);

            if (responseDataSet != null)
            {
                if (responseDataSet.Tables.Count > 0)
                {
                    string file_name = "";
                    try
                    {
                        var book = new XSSFWorkbook();
                        var sheet = book.CreateSheet("Sheet1");
                        Logger.Info("DownloadExcelReports_Click started 1");
                        dynamic headerRow = sheet.CreateRow(0);


                        var style = book.CreateCellStyle();
                        var font = book.CreateFont();


                        // font.FontHeightInPoints = 10;

                        font.IsBold = true;

                        style.SetFont(font);


                        headerRow.CreateCell(0).SetCellValue("Participant Details");
                        headerRow.CreateCell(1).SetCellValue("From");
                        headerRow.CreateCell(2).SetCellValue("To");
                        headerRow.CreateCell(3).SetCellValue("Total Duration");
                        //headerRow.getCell(0).setCellStyle(style);


                        if (responseDataSet.Tables[1].Rows.Count > 0)
                        {
                            var _with1 = responseDataSet.Tables[0];
                            for (int i = 0; i <= _with1.Rows.Count - 1; i++)  // _with1.Rows.Count - 1
                            {
                                dynamic row = sheet.CreateRow(i + 1);
                                row.CreateCell(0).SetCellValue(_with1.Rows[i]["Name"].ToString());
                                row.CreateCell(1).SetCellValue(_with1.Rows[i]["FromTime"].ToString());
                                row.CreateCell(2).SetCellValue(_with1.Rows[i]["ToTime"].ToString());
                                row.CreateCell(3).SetCellValue(_with1.Rows[i]["Duration"].ToString());
                              
                            }
                        }

                        string folderPath = "";
                        folderPath = HttpContext.Current.Server.MapPath("~/TransferAndConferenceCallHistory/");
                        // floderName = "ScriptFileUpload";
                        if (!Directory.Exists(folderPath))
                        {
                            Directory.CreateDirectory(folderPath);
                        }

                        string path = System.Web.HttpContext.Current.Server.MapPath("~");
                        if (hdnCallsType.Value == "4")
                        {
                            file_name = "ConferenceCallHistory_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + ".xlsx";
                        }
                        else {
                            file_name = "TransferCallHistory_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + ".xlsx";
                         
                        }
                        FileStream exportData = new FileStream(path + "/TransferAndConferenceCallHistory/" + file_name, FileMode.CreateNew);
                        book.Write(exportData);
                        HttpContext.Current.Response.Clear();
                        HttpContext.Current.Response.ClearHeaders();
                        HttpContext.Current.Response.ContentType = "application/vnd.ms-excel";
                        HttpContext.Current.Response.AddHeader("Content-Disposition", string.Format("attachment;filename={0}", file_name));
                        System.IO.FileInfo Dfile = new System.IO.FileInfo(path + "/TransferAndConferenceCallHistory/" + file_name);
                        HttpContext.Current.Response.WriteFile(Dfile.FullName);
                        exportData.Close();
                        HttpContext.Current.Response.Flush();
                        System.IO.File.Delete(path + "/TransferAndConferenceCallHistory/" + file_name);
                        HttpContext.Current.Response.End();

                    }
                    catch (Exception ex)
                    {
                        Logger.Info("Download_Reports_Click " + ex.ToString());
                    }
                }
            }
        }
    }
}