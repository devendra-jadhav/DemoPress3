using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
   public class StudioCallerId
    {
        public int Id { get; set; }
        public int StudioId { get; set; }
        public int AccountId { get; set; }
        public int AgentId { get; set; }
        public bool IsDeactive { get; set; }
    }
}
