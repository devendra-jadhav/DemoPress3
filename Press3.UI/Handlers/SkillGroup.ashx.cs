using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using Press3.BusinessRulesLayer;
using Press3.Utilities;
using Press3.UI.CommonClasses;
using Newtonsoft.Json.Linq;

namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for Skills
    /// </summary>
    public class SkillGroup : IHttpHandler, IRequiresSessionState
    {
        int accountId = 0;
        int agentId = 0;
        public void ProcessRequest(HttpContext context)
        {
            try
            {
                if (context.Session["AccountId"] != null)
                {
                    accountId = Convert.ToInt32(context.Session["AccountId"]);
                    agentId = Convert.ToInt32(context.Session["AgentId"]);
                }
                else
                {
                    HttpContext.Current.Response.StatusCode = 401;
                    return;
                }
                JObject resJObj = new JObject();
                int type = Convert.ToInt32(context.Request["type"]);
                switch (type)
                {
                    
                    case 1: // To Get SkillGroup Details
                        resJObj = GetSkillGroup(context);
                        context.Response.Write(resJObj);
                        break;
                    case 2: // To Update SkillGroup Details
                        resJObj = UpdateSkillGroup(context);
                        context.Response.Write(resJObj);
                        break;
                    //case 3: To Get SkillGroupId Details
                      //  resJObj = GetSkillGroupId(context);
                      //  context.Response.Write(resJObj);
                       // break;
                    case 4: // To Delete SkillGroup
                        resJObj = DeleteSkillGroup(context);
                        context.Response.Write(resJObj);
                        break;
                    case 5: // To create SkillGroup
                        resJObj = Create(context);
                        context.Response.Write(resJObj);
                        break;
                    case 6: // to get skillGroups
                        resJObj = GetSkillGroups(context);
                        context.Response.Write(resJObj);
                        break;
                   
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }


        }
       
        public JObject GetSkillGroup(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.SkillGroup skillObj = new Press3.BusinessRulesLayer.SkillGroup();
                resultObj = skillObj.GetSkillGroup(MyConfig.MyConnectionString, accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }

        public JObject UpdateSkillGroup(HttpContext context) 
        {
            JObject resultObj = new JObject();
            int groupId = Convert.ToInt32(context.Request["id"]);
            string skillIds = context.Request["skillIds"];
            String groupName = context.Request["groupName"];
            String Description = context.Request["Description"];
            try
            {
                UserDefinedClasses.SkillGroup skillGroupEntity = new UserDefinedClasses.SkillGroup();
                skillGroupEntity.Id = groupId;
                skillGroupEntity.Name = groupName;
                skillGroupEntity.Description = Description;
                skillGroupEntity.AccountId = accountId;
                skillGroupEntity.AgentId = agentId;
                Press3.BusinessRulesLayer.SkillGroup skillObj = new Press3.BusinessRulesLayer.SkillGroup();
                resultObj = skillObj.UpdateSkillGroup(MyConfig.MyConnectionString, skillIds,skillGroupEntity);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }

        public JObject DeleteSkillGroup(HttpContext context)
        {
            JObject resultObj = new JObject();
            int groupId = Convert.ToInt32(context.Request["groupId"]);
            try
            {
                UserDefinedClasses.SkillGroup skillGroupEntity = new UserDefinedClasses.SkillGroup();
                skillGroupEntity.Id = groupId;
                Press3.BusinessRulesLayer.SkillGroup skillObj = new Press3.BusinessRulesLayer.SkillGroup();
                resultObj = skillObj.DeleteSkillGroup(MyConfig.MyConnectionString, skillGroupEntity,accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }
        public JObject Create(HttpContext context)
        {
            JObject resultObj = new JObject();
            string Name = context.Request["GroupName"];
            string ids = context.Request["skillIds"];
            string Description = context.Request["Description"];
            try
            {
                UserDefinedClasses.SkillGroup skillGroupEntity = new UserDefinedClasses.SkillGroup();
                skillGroupEntity.AccountId = accountId;
                skillGroupEntity.AgentId = agentId;
                skillGroupEntity.Name = Name;                
                skillGroupEntity.Description = Description;
                Press3.BusinessRulesLayer.SkillGroup skillObj = new Press3.BusinessRulesLayer.SkillGroup();
                resultObj = skillObj.Create(MyConfig.MyConnectionString,skillGroupEntity,ids);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }

        public JObject GetSkillGroups(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.SkillGroup skillObj = new Press3.BusinessRulesLayer.SkillGroup();
                resultObj = skillObj.GetSkillGroups(MyConfig.MyConnectionString, accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
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