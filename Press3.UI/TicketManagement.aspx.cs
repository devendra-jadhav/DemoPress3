using NPOI.XSSF.UserModel;
using Press3.UI.CommonClasses;
using Press3.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using UDC = Press3.UserDefinedClasses;

namespace Press3.UI
{
    public partial class TicketManagement : System.Web.UI.Page
    {
        public int accountId = 0; public int agentId = 0; public int roleId = 0;
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
                agentId = Convert.ToInt32(Session["AgentId"]);
                roleId = Convert.ToInt32(Session["RoleId"]);
            }
        }
        public void DownloadTicketExcelReports_Click(object sender, EventArgs e)
        {
            DataSet responseDataSet = new DataSet();
            UDC.Ticket ticket = new UDC.Ticket();
            ticket.Mode = 1;

            if (roleId == 1)
            {
                ticket.AgentId = agentId;
                ticket.SelectedAgentId = agentId;

            }
            else
            {
                ticket.AgentId = agentId;
                ticket.SelectedAgentId = Convert.ToInt32(hdnAgentId.Value);


            }
        
            
            ticket.AccountId = accountId;
            ticket.RoleId = roleId;
            ticket.Id = hdnTicketId.Value != null ? Convert.ToInt32(hdnTicketId.Value) : 0;
            ticket.Subject = hdnTicketSubject.Value;
            ticket.StatusIds = hdnTicketStatuses.Value;
            ticket.PriorityIds = hdnTicketPriorities.Value;
            ticket.TicketType = hdnTicketType.Value != null ? Convert.ToInt32(hdnTicketType.Value) : 0;
            ticket.OverDueType = hdnDueType.Value != null ? Convert.ToInt32(hdnDueType.Value) : 0;
            ticket.DurationType = hdnDurationType.Value != null ? Convert.ToInt32(hdnDurationType.Value) : 0;
            ticket.CustomerId = 0;
            ticket.FromDate = hdnFromDate.Value;
            ticket.ToDate = hdnToDate.Value;
            ticket.PageIndex = Convert.ToInt32(hdnPageIndex.Value);
            ticket.PageSize = Convert.ToInt32(hdnPageSize.Value);
            ticket.IsStarred = Convert.ToBoolean(Convert.ToInt16(hdnIsStarred.Value));
            ticket.CategoryId = hdnCategoryId.Value != "0" ? Convert.ToInt32(hdnCategoryId.Value) : 0;
            Press3.BusinessRulesLayer.Ticket ticketObj = new Press3.BusinessRulesLayer.Ticket();
            responseDataSet = ticketObj.DownloadTicketsHistory(MyConfig.MyConnectionString, ticket);

            int temp = responseDataSet.Tables.Count;
            int temp2 = responseDataSet.Tables[0].Rows.Count;
            int temp3 = responseDataSet.Tables[1].Rows.Count;

            if (responseDataSet != null)
            {
                if (responseDataSet.Tables.Count > 0)
                {
                    string file_name = "";
                    try
                    {
                        var book = new XSSFWorkbook();
                        var sheet = book.CreateSheet("Sheet1");
                        Logger.Info("DownloadExcelReports started 1");
                        dynamic headerRow = sheet.CreateRow(0);
                        headerRow.CreateCell(0).SetCellValue("Agent Name");
                        headerRow.CreateCell(1).SetCellValue("Ticket Number");
                        headerRow.CreateCell(2).SetCellValue("Status");
                        headerRow.CreateCell(3).SetCellValue("Type Of Service");
                        headerRow.CreateCell(4).SetCellValue("Priority");
                        headerRow.CreateCell(5).SetCellValue("Ticket Created Time");
                        headerRow.CreateCell(6).SetCellValue("Ticket Updated Time");
                        headerRow.CreateCell(7).SetCellValue("Ticket Updated by");
                        headerRow.CreateCell(8).SetCellValue("Due Date");
                        if (responseDataSet.Tables[0].Rows.Count > 0)
                        {
                            var _with1 = responseDataSet.Tables[0];
                            for (int i = 0; i <= _with1.Rows.Count - 1; i++)
                            {
                                dynamic row = sheet.CreateRow(i + 1);
                                for (int c = 0; c <= responseDataSet.Tables[0].Columns.Count - 1; c++)
                                {
                                    row.CreateCell(c).SetCellValue(_with1.Rows[i][c].ToString());
                                }
                            }
                        }
                       
                        string folderPath = "";
                        folderPath = HttpContext.Current.Server.MapPath("~/TicketHistory/");
                        // floderName = "ScriptFileUpload";
                        if (!Directory.Exists(folderPath))
                        {
                            Directory.CreateDirectory(folderPath);
                        }

                        string path = System.Web.HttpContext.Current.Server.MapPath("~");
                        file_name = "TicketHistory_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + ".xlsx";
                        FileStream exportData = new FileStream(path + "/TicketHistory/" + file_name, FileMode.CreateNew);
                        book.Write(exportData);
                        HttpContext.Current.Response.Clear();
                        HttpContext.Current.Response.ClearHeaders();
                        HttpContext.Current.Response.ContentType = "application/vnd.ms-excel";
                        HttpContext.Current.Response.AddHeader("Content-Disposition", string.Format("attachment;filename={0}", file_name));
                        System.IO.FileInfo Dfile = new System.IO.FileInfo(path + "/TicketHistory/" + file_name);
                        HttpContext.Current.Response.WriteFile(Dfile.FullName);
                        exportData.Close();
                        HttpContext.Current.Response.Flush();
                        System.IO.File.Delete(path + "/TicketHistory/" + file_name);
                        HttpContext.Current.Response.End();
                    }
                    catch (Exception ex)
                    {
                        Logger.Info("DownloadExcelReports " + ex.ToString());
                    }
                }
            }
        }
    }
}