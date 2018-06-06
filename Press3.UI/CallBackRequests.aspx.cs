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
    public partial class CallBackRequests : System.Web.UI.Page
    {
        public Int32 accountId = 0, agentId = 0,CbrId =0;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Convert.ToInt32(Session["RoleId"]) == 1)
            {
                Response.Redirect("/UnAuthorised.aspx");
                return;
            }
            if (Session["AccountId"] == null)
            {
                Response.Redirect("/Login.aspx?message=Session expired");
                return;
            }
            else
            {
                accountId = Convert.ToInt32(Session["AccountId"]);
                agentId = Convert.ToInt32(Session["AgentId"]);
            }
            if (!string.IsNullOrEmpty(Request.QueryString["CbrId"]))
            {
                CbrId = Convert.ToInt32(Request.QueryString["CbrId"]);
            }
            
        }

        protected void DownloadToExcel_Click(object sender, EventArgs e)
        {
            DataSet ds = new DataSet();
            UserDefinedClasses.CallbackRequest cbrObj = new UserDefinedClasses.CallbackRequest();
            cbrObj.Mode = 2;
            cbrObj.AccountId = Session["AccountId"] != null ? Convert.ToInt32(Session["AccountId"]) : 0;
            cbrObj.AgentId = Session["AgentId"] != null ? Convert.ToInt32(Session["AgentId"]) : 0;
            cbrObj.AssignedAgentId = hdnStickyAgent.Value != null ? Convert.ToInt32(hdnStickyAgent.Value) : 0;
            cbrObj.StatusId = hdnstatus.Value != null ? Convert.ToInt32(hdnstatus.Value) : 0;
            cbrObj.SkillGroupId = hdnSkillGroup.Value != null ? Convert.ToInt32(hdnSkillGroup.Value) : 0;
            cbrObj.DialType = hdnDialOutType.Value != null ? Convert.ToInt32(hdnDialOutType.Value) : 0;
            cbrObj.FromDate = hdnFromDate.Value != null ? hdnFromDate.Value.ToString() : "";
            cbrObj.ToDate = hdnToDate.Value != null ? hdnToDate.Value.ToString() : "";
            cbrObj.SearchText = hdnSearchText.Value != null ? hdnSearchText.Value.ToString() : "";
            cbrObj.StudioId = hdnStudioId.Value != null ? Convert.ToInt32(hdnStudioId.Value) : 0;
            cbrObj.PageNumber =  1;
            cbrObj.PageSize = 0;
                   

            Press3.BusinessRulesLayer.Calls callObj = new Press3.BusinessRulesLayer.Calls();
            ds = callObj.DownloadCallBackRequests(MyConfig.MyConnectionString, cbrObj);

            string file_name = "";
            if (ds.Tables[0].Rows.Count > 0)
            {
                try
                {
                    var wb = new XSSFWorkbook();
                    var sheet = wb.CreateSheet("sheet1");
                    dynamic headerRow = sheet.CreateRow(0);

                    //headerRow.CreateCell(0).SetCellValue("Id");
                    headerRow.CreateCell(0).SetCellValue("Status");
                    headerRow.CreateCell(1).SetCellValue("Closed By");
                    headerRow.CreateCell(2).SetCellValue("Scheduled On");
                    headerRow.CreateCell(3).SetCellValue("Caller Name");
                    headerRow.CreateCell(4).SetCellValue("Mobile Number");
                    headerRow.CreateCell(5).SetCellValue("CBR Notes");
                    headerRow.CreateCell(6).SetCellValue("IVR-Studio");
                    headerRow.CreateCell(7).SetCellValue("Created By");
                    headerRow.CreateCell(8).SetCellValue("Created On");
                    headerRow.CreateCell(9).SetCellValue("Skill Group");
                    headerRow.CreateCell(10).SetCellValue("Sticky Agent");
                    headerRow.CreateCell(11).SetCellValue("Dial Type");

                    //var dstable = ds.tables[0];

                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        var _with1 = ds.Tables[0];
                        for (int i = 0; i <= _with1.Rows.Count - 1; i++)  // _with1.Rows.Count - 1
                        {
                            dynamic row = sheet.CreateRow(i + 1);
                            for (int c = 0; c <= ds.Tables[0].Columns.Count - 1; c++)
                            {

                                switch (c)
                                {
                                    case 0: row.CreateCell(c).SetCellValue(_with1.Rows[i]["Status"].ToString()); break;
                                    case 1: row.CreateCell(c).SetCellValue("-"); break;
                                    case 2: row.CreateCell(c).SetCellValue(_with1.Rows[i]["CallDateTime"].ToString()); break;
                                    case 3: row.CreateCell(c).SetCellValue(_with1.Rows[i]["CallerName"].ToString()); break;
                                    case 4: row.CreateCell(c).SetCellValue(_with1.Rows[i]["Mobile"].ToString()); break;
                                    case 5: row.CreateCell(c).SetCellValue(_with1.Rows[i]["Notes"].ToString()); break;
                                    case 6: row.CreateCell(c).SetCellValue(_with1.Rows[i]["StudioName"].ToString()); break;
                                    case 7: row.CreateCell(c).SetCellValue(_with1.Rows[i]["CreatedBy"].ToString()); break;
                                    case 8: row.CreateCell(c).SetCellValue(_with1.Rows[i]["CreatedOn"].ToString()); break;
                                    case 9: row.CreateCell(c).SetCellValue(_with1.Rows[i]["Name"].ToString()); break;
                                    case 10: row.CreateCell(c).SetCellValue(_with1.Rows[i]["AssignedToAgent"].ToString()); break;
                                    case 11: row.CreateCell(c).SetCellValue(_with1.Rows[i]["DialType"].ToString()); break;

                                }
                            }
                        }
                    }

                    //for (var i = 0; i < ds.Tables[0].Rows.Count; i++)
                    //{
                    //    dynamic row = sheet.CreateRow(i + 1);
                    //    for (var c = 0; c < ds.Tables[0].Columns.Count - 2; c++)
                    //    {
                    //        row.CreateCell(c).SetCellValue(ds.Tables[0].Rows[i][c + 1].ToString());
                    //    }
                    //}

                    string folderPath = "";
                    folderPath = HttpContext.Current.Server.MapPath("~/CallBackRequests/");
                    // floderName = "ScriptFileUpload";
                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }

                    string path = System.Web.HttpContext.Current.Server.MapPath("~");
                    file_name = "CallBackRequests_" + DateTime.Now.ToString("ddMMyyyyHHmmssfffff") + ".xlsx";

                    using (var exportData = new FileStream(path + "/CallBackRequests/" + file_name, FileMode.CreateNew))
                    {
                        wb.Write(exportData);
                    }
                    HttpContext.Current.Response.Clear();
                    HttpContext.Current.Response.ClearHeaders();
                    HttpContext.Current.Response.ContentType = "application/vnd.ms-excel";
                    HttpContext.Current.Response.AddHeader("Content-Disposition", string.Format("attachment;filename={0}", file_name));
                    FileInfo Dfile = new FileInfo(path + "/CallBackRequests/" + file_name);
                    HttpContext.Current.Response.WriteFile(Dfile.FullName);
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