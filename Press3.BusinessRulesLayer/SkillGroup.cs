using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using UDC = Press3.UserDefinedClasses;
using Press3.Utilities;
using System.Data;

namespace Press3.BusinessRulesLayer
{
    public class SkillGroup
    {
        private Helper _helper = null;
        public SkillGroup()
        {
            _helper = new Helper();
            _helper.ResponseFormat = UDC.ResponseFormat.JSON;
            _helper.InitializeResponseVariables();
        }
       
        public JObject GetSkillGroup(string connectionString, int accountId)
        {
            try
            {
                if (accountId == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "AccountId is mandatory");
                }
                else
                {
                    DataAccessLayer.SkillGroup skillObj = new DataAccessLayer.SkillGroup(connectionString);
                    System.Data.DataSet ds = skillObj.GetSkillGroup(accountId);
                    if (ds.IsNull())
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, skillObj.ErrorMessage);
                    }
                    else
                    {
                        _helper.ParseDataSet(ds);
                    }
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }
        public JObject UpdateSkillGroup(string connectionString, string skillIds, UDC.SkillGroup skillGroupEntity)
        {
            try
            {
                if (skillGroupEntity.Id == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "GroupId is mandatory");
                }
                else
                {
                    DataTable table = GetTable(skillIds);
                    DataAccessLayer.SkillGroup skillObj = new DataAccessLayer.SkillGroup(connectionString);
                    System.Data.DataSet ds = skillObj.UpdateSkillGroup(table, skillGroupEntity);
                    if (ds.IsNull())
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, skillObj.ErrorMessage);
                    }
                    else
                    {
                        _helper.ParseDataSet(ds);
                    }
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }

        public JObject DeleteSkillGroup(string connectionString, UDC.SkillGroup skillGroupEntity,int accountId)
        {
            try
            {
                if (skillGroupEntity.Id == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "GroupId is mandatory");
                }
                else
                {
                    DataAccessLayer.SkillGroup skillObj = new DataAccessLayer.SkillGroup(connectionString);
                    System.Data.DataSet ds = skillObj.DeleteSkillGroup(skillGroupEntity,accountId);
                    if (ds.IsNull())
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, skillObj.ErrorMessage);
                    }
                    else
                    {
                        _helper.ParseDataSet(ds);
                    }
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }

        public JObject Create(string connectionString, UDC.SkillGroup skillGroupEntity, string ids)
        {
            try
            {
                if (skillGroupEntity.AccountId == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "AccountId is mandatory");
                }
                else if (skillGroupEntity.Name == null || skillGroupEntity.Name.Trim().Length == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "Group name is mandatory");
                }
                else
                {
                    DataTable table = GetTable(ids);
                    DataAccessLayer.SkillGroup skillObj = new DataAccessLayer.SkillGroup(connectionString);
                    System.Data.DataSet ds = skillObj.Create(skillGroupEntity, table);
                    if (ds.IsNull())
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, skillObj.ErrorMessage);
            }
                    else
                        _helper.ParseDataSet(ds);
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();

        }
        public DataTable GetTable(string ids)
        {
            var s = ids.Split(',');
            DataTable table = new DataTable();
            table.Columns.Add("Id", typeof(int));
        for(int i=0;i<s.Length;i++)
            {
                table.Rows.Add(s[i]);
            }
        
            return table;
        }
        public JObject GetSkillGroups(string connectionString, int accountId)
        {
            try
            {
                DataAccessLayer.SkillGroup skillObj = new DataAccessLayer.SkillGroup(connectionString);
                System.Data.DataSet ds = skillObj.GetSkillGroups(accountId);
                if (ds.IsNull())
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, skillObj.ErrorMessage);
                }
                else
                {
                    _helper.ParseDataSet(ds);
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }

        public DataSet GetSkillGroupsDs(String connection, int accountId)
        {
            DataSet ds = new DataSet();
            try
            {
                DataAccessLayer.SkillGroup skillObj = new DataAccessLayer.SkillGroup(connection);
                ds = skillObj.GetSkillGroups(accountId);
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetSkillGroupsDs " + ex.ToString());
            }
            return ds;
        }
        public DataSet GetStudioSkillGroups(String connection, int studioId)
        {
            DataSet ds = new DataSet();
            try
            {
                DataAccessLayer.SkillGroup skillObj = new DataAccessLayer.SkillGroup(connection);
                ds = skillObj.GetStudioSkillGroups(studioId);
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In BAL.GetStudioSkillGroups " + ex.ToString());
            }
            return ds;
        }

        
    }
}
