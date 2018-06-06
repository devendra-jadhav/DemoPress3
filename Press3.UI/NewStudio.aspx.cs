using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Press3.UI.CommonClasses;

namespace Press3.UI
{
    public partial class NewStudio : System.Web.UI.Page
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
                studioId = Convert.ToInt32(Context.Request.QueryString["StudioId"]);
            }
            ivrStudioShowClipUploadPath = MyConfig.IvrStudioShowClipUploadPath;
            actionUrl = MyConfig.ActionUrl;
            
        }
    }
}