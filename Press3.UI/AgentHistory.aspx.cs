using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using Press3.Utilities;
using UDC = Press3.UserDefinedClasses;
using Press3.BusinessRulesLayer;
using Press3.UI.CommonClasses;
using System.IO;
using NPOI.XSSF.UserModel;

namespace Press3.UI
{
    public partial class AgentHistory : System.Web.UI.Page
    {
        public Int32 agentId = 0;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["AccountId"] == null)
            {
                Response.Redirect("/Login.aspx?message=Session expired");
                return;
            }
            if (Convert.ToInt32(Session["RoleId"]) == 1)
            {
                Response.Redirect("/UnAuthorised.aspx");
                return;
            }
        }
        public void DownloadExcelReports_Click(object sender, EventArgs e)
        {
            string res = string.Empty;
            DataSet ds = new DataSet();
            UDC.AgentHistory agentHistory = new UDC.AgentHistory();
            agentHistory.AccountId = Session["AccountId"] != null ? Convert.ToInt32(Session["AccountId"]) : 0;
            agentHistory.AgentId =hdnAgentId.Value != null ? Convert.ToInt32(hdnAgentId.Value) : 0;
            agentHistory.DurationType = hdnDurationType.Value != null ? Convert.ToByte(hdnDurationType.Value) : Convert.ToByte(0);
            agentHistory.FromDate = hdnFromDate.Value.ToString();
            agentHistory.ToDate = hdnToDate.Value.ToString();
            agentHistory.SkillGroupId = hdnSkillGroupId.Value != null ? Convert.ToInt32(hdnSkillGroupId.Value) : 0;
            agentHistory.Rating = hdnRating.Value != null ? Convert.ToByte(hdnRating.Value) : Convert.ToByte(0);
            agentHistory.Index = 1;
            agentHistory.Length = 0; 
            agentHistory.SessionAgentId = Convert.ToInt32(Session["AgentId"]);
            agentHistory.RoleId = Convert.ToInt32(Session["RoleId"]);



            Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
            ds = managerObj.DownloadAgentsHistory(MyConfig.MyConnectionString, agentHistory);

            if (ds.Tables.Count > 0)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    string file_name = "";
                    try
                    {
                        var book = new XSSFWorkbook();
                        var sheet = book.CreateSheet("Sheet1");

                        dynamic headerRow = sheet.CreateRow(0);

                        headerRow.CreateCell(0).SetCellValue("Slno");
                        headerRow.CreateCell(1).SetCellValue("Agent Name");
                        headerRow.CreateCell(2).SetCellValue("SKill Group(s)");
                        headerRow.CreateCell(3).SetCellValue("Logged In (HH:MM:SS)");
                        headerRow.CreateCell(4).SetCellValue("Available (HH:MM:SS (%))");
                        headerRow.CreateCell(5).SetCellValue("In Break (HH:MM:SS (%))");
                        headerRow.CreateCell(6).SetCellValue("Idle (HH:MM:SS (%))");
                        headerRow.CreateCell(7).SetCellValue("OWA (HH:MM:SS (%))");
                        headerRow.CreateCell(8).SetCellValue("On Call (HH:MM:SS (%))");
                        headerRow.CreateCell(9).SetCellValue("ACW (HH:MM:SS (%))");
                        headerRow.CreateCell(10).SetCellValue("Total Calls");
                        headerRow.CreateCell(11).SetCellValue("Service Level");
                        headerRow.CreateCell(12).SetCellValue("Average Speed of Answer");
                        headerRow.CreateCell(13).SetCellValue("Average Talktime");
                        headerRow.CreateCell(14).SetCellValue("Average Handletime");
                        headerRow.CreateCell(15).SetCellValue("Rating");

                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            var _with1 = ds.Tables[0];
                          
                            for (int i = 0; i <= _with1.Rows.Count - 1; i++)  // _with1.Rows.Count - 1
                            {
                                dynamic row = sheet.CreateRow(i + 1);
                                
                                //for (int c = 0; c <= ds.Tables[0].Columns.Count; c++)
                                //{
                                    row.CreateCell(0).SetCellValue(_with1.Rows[i]["row_num"].ToString());
                                    row.CreateCell(1).SetCellValue(_with1.Rows[i]["AgentName"].ToString());
                                    row.CreateCell(2).SetCellValue(_with1.Rows[i]["SkillGroups"].ToString());
                                    row.CreateCell(3).SetCellValue(_with1.Rows[i]["LoggedInHrs"].ToString());
                                    row.CreateCell(4).SetCellValue(_with1.Rows[i]["AvailableTimeInHrs"].ToString());
                                    row.CreateCell(5).SetCellValue(_with1.Rows[i]["InBreakTimeInHrs"].ToString());
                                    row.CreateCell(6).SetCellValue(_with1.Rows[i]["IdleTimeInHrs"].ToString());
                                    row.CreateCell(7).SetCellValue(_with1.Rows[i]["OWATimeInHrs"].ToString());
                                    row.CreateCell(8).SetCellValue(_with1.Rows[i]["OnCallTimeInHrs"].ToString());
                                    row.CreateCell(9).SetCellValue(_with1.Rows[i]["ACWTimeInHrs"].ToString());
                                    row.CreateCell(10).SetCellValue(_with1.Rows[i]["TotalCalls"].ToString());
                                    row.CreateCell(11).SetCellValue(_with1.Rows[i]["CurrentSLA"].ToString());
                                    row.CreateCell(12).SetCellValue(_with1.Rows[i]["SpeedOfAnswer"].ToString());
                                    row.CreateCell(13).SetCellValue(_with1.Rows[i]["TalkTime"].ToString());
                                    row.CreateCell(14).SetCellValue(_with1.Rows[i]["HandleTime"].ToString());
                                    row.CreateCell(15).SetCellValue(_with1.Rows[i]["Rating"].ToString());
                                //}
                            }
                        }


                        string folderPath = "";
                        folderPath = HttpContext.Current.Server.MapPath("~/AgentHistory/");
                        // floderName = "ScriptFileUpload";
                        if (!Directory.Exists(folderPath))
                        {
                            Directory.CreateDirectory(folderPath);
                        }

                        string path = System.Web.HttpContext.Current.Server.MapPath("~");

                        file_name = "AgentsReport_" + DateTime.Now.ToString("ddMMyyyyHHmmssfffff") + ".xlsx";


                        FileStream exportData = new FileStream(path + "/AgentHistory/" + file_name, FileMode.CreateNew);
                        book.Write(exportData);
                        HttpContext.Current.Response.Clear();
                        HttpContext.Current.Response.ClearHeaders();
                        HttpContext.Current.Response.ContentType = "application/vnd.ms-excel";
                        HttpContext.Current.Response.AddHeader("Content-Disposition", string.Format("attachment;filename={0}", file_name));
                        System.IO.FileInfo Dfile = new System.IO.FileInfo(path + "/AgentHistory/" + file_name);
                        HttpContext.Current.Response.WriteFile(Dfile.FullName);
                        exportData.Close();
                        HttpContext.Current.Response.Flush();
                        HttpContext.Current.Response.End();

                    }
                    catch (Exception ex)
                    {
                        Logger.Error(ex.ToString());
                    }
                }
            }
        }
    }
}