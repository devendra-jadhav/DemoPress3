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
    public partial class CallAbandonedHistory : System.Web.UI.Page
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
         
            int AccountId = accountId;
            string Date = hdnDate.Value != null ? hdnDate.Value : "";
            int AgentId;
            DataSet responseDataSet = new DataSet();
            if (Convert.ToInt32(Session["RoleId"]) == 1)
            {
                 AgentId = agentId;
            }
            else
            {
                 AgentId = hdnAgent.Value != null ? Convert.ToInt32(hdnAgent.Value) : 0;
            }
            int sessionAgentId = Convert.ToInt32(Session["AgentId"]);
            
             int CallType = hdnCallType.Value != null ? Convert.ToInt32(hdnCallType.Value) : 0;
            int SkillGroupId = hdnRingGroup.Value != null ? Convert.ToInt32(hdnRingGroup.Value) : 0;
            string FromDate = hdnFromDate.Value;
            string ToDate = hdnToDate.Value;
            int CallDirection = hdnCallDirection.Value != null ? Convert.ToInt32(hdnCallDirection.Value) : 0;
            int CallEndStatus = hdnCallEndStatus.Value != null ? Convert.ToInt32(hdnCallEndStatus.Value) : 0;
            int PageSize = hdnPageSize.Value != null ? Convert.ToInt32(hdnPageSize.Value) : 0;
           int PageNumber = hdnPageNumber.Value != null ? Convert.ToInt32(hdnPageNumber.Value) : 0;
           int StudioId = hdnStudioId.Value != null ? Convert.ToInt32(hdnStudioId.Value) : 0;
           int excelDownload = 1;

            Press3.BusinessRulesLayer.Calls callsObject = new Press3.BusinessRulesLayer.Calls();
            responseDataSet = callsObject.DownloadCallAbandonedHistory(MyConfig.MyConnectionString, accountId, Date, CallDirection, CallType, CallEndStatus, AgentId, SkillGroupId, FromDate, ToDate, PageSize, PageNumber,StudioId,sessionAgentId,roleId,excelDownload);
           
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

                   
                       

                        font.IsBold = true;

                        style.SetFont(font);
                       
                        headerRow.CreateCell(0).SetCellValue("Call Received Time");
                        headerRow.CreateCell(1).SetCellValue("IVR-Studio");
                        headerRow.CreateCell(2).SetCellValue("Call Type");
                        headerRow.CreateCell(3).SetCellValue("Call End Status");
                        headerRow.CreateCell(4).SetCellValue("End Time");
                        headerRow.CreateCell(5).SetCellValue("Call Direction");
                        headerRow.CreateCell(6).SetCellValue("CallerDetails"); 
                        headerRow.CreateCell(7).SetCellValue("SkillGroup");
                        headerRow.CreateCell(8).SetCellValue("Missed Agents");
                        headerRow.CreateCell(9).SetCellValue("Answered Agents");
               

                        if (responseDataSet.Tables[0].Rows.Count > 0)
                        {
                            var _with1 = responseDataSet.Tables[0];
                            for (int i = 0; i <= _with1.Rows.Count - 1; i++)  // _with1.Rows.Count - 1
                            {
                                       dynamic row = sheet.CreateRow(i + 1);
                                       row.CreateCell(0).SetCellValue(_with1.Rows[i]["CallReceivedTime"].ToString());
                                       row.CreateCell(1).SetCellValue(_with1.Rows[i]["StudioName"].ToString()); 
                                       row.CreateCell(2).SetCellValue(_with1.Rows[i]["CallType"].ToString()); 
                                       row.CreateCell(3).SetCellValue(_with1.Rows[i]["CallEndStatus"].ToString());
                                       row.CreateCell(4).SetCellValue((_with1.Rows[i]["EndTime"].ToString() == "") ? _with1.Rows[i]["EndTime"].ToString() :_with1.Rows[i]["EndTime"].ToString() + " ("+_with1.Rows[i]["TimeDifference"].ToString()+" secs)");
                                      
                                       string val = (_with1.Rows[i]["callType"].ToString());
                                       row.CreateCell(5).SetCellValue((val=="1")?"OutBound":"In bound");
                                       row.CreateCell(6).SetCellValue((_with1.Rows[i]["callerDetails"].ToString() == "") ? _with1.Rows[i]["source"].ToString() : (_with1.Rows[i]["callerDetails"].ToString() +" "+ _with1.Rows[i]["CallerNumber"].ToString())); 
                                       row.CreateCell(7).SetCellValue(_with1.Rows[i]["skillGroup"].ToString());
                                       int callId = Convert.ToInt32(_with1.Rows[i]["CallId"]);
                                       string value = ""; int Count = 0;
                                       for (int j = 0; j <= responseDataSet.Tables[1].Rows.Count - 1; j++)
                                       {

                                           if (Convert.ToInt32(responseDataSet.Tables[1].Rows[j]["CallId"]) == callId)
                                           {
                                               
                                               if (responseDataSet.Tables[1].Rows[j]["AgentName"].ToString() == _with1.Rows[i]["AgentName"].ToString() )
                                               {
                                                   if (Convert.ToInt32(responseDataSet.Tables[1].Rows[j]["AssignedCount"]) > 1)
                                                   {   Count++;
                                                       value += responseDataSet.Tables[1].Rows[j]["AgentName"].ToString() + "(" + (Convert.ToInt32(responseDataSet.Tables[1].Rows[j]["AssignedCount"]) - 1).ToString() + ")  ";
                                                   }
                                                   else
                                                   {
                                                       break;
                                                   }
                                               }
                                               else
                                               {   Count++;
                                                   value += responseDataSet.Tables[1].Rows[j]["AgentName"].ToString() + "("+responseDataSet.Tables[1].Rows[j]["AssignedCount"].ToString() + ")  ";
                                               }
                                           }
                                       }
                                        if (Count == 0 && _with1.Rows[i]["CallEndStatus"].ToString()=="Abandoned"){
                                            if (_with1.Rows[i]["CallType"].ToString() == "Missed")
                                            { value = _with1.Rows[i]["AgentName"].ToString() + "(1)"; }
                                        }
                                row.CreateCell(8).SetCellValue(value); 
                                row.CreateCell(9).SetCellValue((_with1.Rows[i]["CallEndStatus"].ToString()=="Answered")?_with1.Rows[i]["AgentName"].ToString():"");


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
                        file_name = "CallAbandonedHistory_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + ".xlsx";
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
   
    
    
    }
}