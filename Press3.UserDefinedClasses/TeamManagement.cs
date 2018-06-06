using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class TeamManagement
    {
        public int AgentId { get; set; }
        public int AccountId { get; set; }
        public int Supervisor_Id { get; set; }
        public int Mode { get; set; }
        public int AgentToAssign { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int AgentToRelease { get; set; }
    }
}
