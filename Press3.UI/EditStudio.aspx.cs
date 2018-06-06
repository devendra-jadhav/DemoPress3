using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Press3.UI.CommonClasses;

namespace Press3.UI
{
    public partial class EditStudio : System.Web.UI.Page
    {
        public Int32 studioId = 0;
        public string ivrStudioShowClipUploadPath = string.Empty;
        public string actionUrl = string.Empty;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Convert.ToInt32(Session["RoleId"]) != 3)
            {
                Response.Redirect("/UnAuthorised.aspx");
                return;
            }
            if (Context.Request.QueryString["StudioId"] != null)
            {
                int n;
                bool isNumeric = int.TryParse(Context.Request.QueryString["StudioId"], out n);
                if (isNumeric == true)
                {
                    studioId = Convert.ToInt32(Context.Request.QueryString["StudioId"]);
                }
                else
                {
                    Context.Response.Write("StudioId parameter should be an integer");
                    Context.Response.End();
                }
            }
            else
            {
                Context.Response.Write("Please pass StudioId parameter");
                Context.Response.End();
            }
            ivrStudioShowClipUploadPath = MyConfig.IvrStudioShowClipUploadPath;
            actionUrl = MyConfig.ActionUrl;
        }
    }
}