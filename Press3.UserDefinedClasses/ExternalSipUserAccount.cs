using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class ExternalSipUserAccount
    {
        public int Id { get; set; }
        public int AgentId { get; set; }
        public string Ip { get; set; }
        public Nullable<int> Port { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedTime { get; set; }
        public Nullable<int> UpdatedBy { get; set; }
    }
}
