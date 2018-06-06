using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using Press3.Utilities;


namespace Press3.DataAccessLayer
{
    public  class AgentContact : DataAccess
    {      SqlCommand _cmd;
         SqlDataAdapter _da;
          DataSet _ds;
        readonly Helper _helper = new Helper();
        public AgentContact(string sConstring) : base(sConstring) { }
        public DataSet AddContactDetails(String connection, string number, int agentId, string groupName, string existingGroup, int mode, string name, string email, string notes, string alternatemobile,string OldContact)
         {
         _cmd = new SqlCommand();
            _ds = new DataSet();
            _da = new SqlDataAdapter();
            try
            {
                _cmd.CommandText = "GetContactDetails";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
               
                _cmd.Parameters.Add("@Mode", SqlDbType.BigInt).Value = mode;
                _cmd.Parameters.Add("@Number", SqlDbType.VarChar,20).Value = number;
                _cmd.Parameters.Add("@OldNumber", SqlDbType.VarChar, 20).Value = OldContact;
				 _cmd.Parameters.Add("@AlternateNumber", SqlDbType.VarChar,20).Value = alternatemobile;
                _cmd.Parameters.Add("@Name", SqlDbType.NVarChar, 200).Value =name;
                _cmd.Parameters.Add("@Email", SqlDbType.VarChar, 1000).Value = email;
				 _cmd.Parameters.Add("@Note", SqlDbType.VarChar, 1000).Value = notes;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                 _cmd.Parameters.Add("@GroupName", SqlDbType.VarChar, 1000).Value = groupName;
				  _cmd.Parameters.Add("@ExistingGroup", SqlDbType.VarChar, 1000).Value = existingGroup;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);

                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "Contacts";
                }
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw ex;
            }
            finally
            {
                _cmd = null;
                _da = null;
            }
            return _ds;
        }
          public DataSet GetContactGroups(int agentId)
          {
              _cmd = new SqlCommand();
              _ds = new DataSet();
              _da = new SqlDataAdapter();
              try
              {
                  _cmd.CommandText = "GetContactGroups";
                  _cmd.CommandType = CommandType.StoredProcedure;
                  _cmd.Connection = Connection;
                  _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                  _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                  _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                  _da.SelectCommand = _cmd;
                  _da.Fill(_ds);
                  if (_ds.Tables.Count > 0)
                  {
                     
                          _ds.Tables[0].TableName = "Groups";
                        
                    
                     
                  }
                  _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
              }
              catch (Exception ex)
              {
                  Logger.Error(ex.ToString());
                  throw;
              }
              finally
              {
                  Connection.Close();
                  _cmd = null;
              }
              return _ds;
          }







          public DataSet GetContactTable(int agentId)
          {
              _cmd = new SqlCommand();
              _ds = new DataSet();
              _da = new SqlDataAdapter();
              try
              {
                  _cmd.CommandText = "GetContactTable";
                  _cmd.CommandType = CommandType.StoredProcedure;
                  _cmd.Connection = Connection;
                  _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                  _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                  _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                  _da.SelectCommand = _cmd;
                  _da.Fill(_ds);
                  if (_ds.Tables.Count > 0)
                  {

                      _ds.Tables[0].TableName = "ContactTable";



                  }
                  _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
              }
              catch (Exception ex)
              {
                  Logger.Error(ex.ToString());
                  throw;
              }
              finally
              {
                  Connection.Close();
                  _cmd = null;
              }
              return _ds;
            
          }
          public DataSet DeleteContact( int agentId, string Number)
          { 
              _cmd = new SqlCommand();
              _ds = new DataSet();
              _da = new SqlDataAdapter();
              try
              {
                  _cmd.CommandText = "DeleteContact";
                  _cmd.CommandType = CommandType.StoredProcedure;
                  _cmd.Connection = Connection;
                  _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                  _cmd.Parameters.Add("@Number", SqlDbType.VarChar, 20).Value = Number;
                  _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                  _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                  _da.SelectCommand = _cmd;
                  _da.Fill(_ds);
                  if (_ds.Tables.Count > 0)
                  {

                      _ds.Tables[0].TableName = "Groups";



                  }
                  _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
              }
              catch (Exception ex)
              {
                  Logger.Error(ex.ToString());
                  throw;
              }
              finally
              {
                  Connection.Close();
                  _cmd = null;
              }
              return _ds; 
          }

          public DataSet GetTableByGroups(int agentId, string groupName)
          {
              _cmd = new SqlCommand();
              _ds = new DataSet();
              _da = new SqlDataAdapter();
              try
              {
                  _cmd.CommandText = "GetTableBygroup";
                  _cmd.CommandType = CommandType.StoredProcedure;
                  _cmd.Connection = Connection;
                  _cmd.Parameters.Add("@AgentId", SqlDbType.BigInt).Value = agentId;
                  _cmd.Parameters.Add("@GroupName", SqlDbType.VarChar, 20).Value = groupName;
                  _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                  _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                  _da.SelectCommand = _cmd;
                  _da.Fill(_ds);
                  if (_ds.Tables.Count > 0)
                  {

                      _ds.Tables[0].TableName = "ContactTable";



                  }
                  _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
              }
              catch (Exception ex)
              {
                  Logger.Error(ex.ToString());
                  throw;
              }
              finally
              {
                  Connection.Close();
                  _cmd = null;
              }
              return _ds;
          }
    
    
    }


}
     
     
     
     
     
     