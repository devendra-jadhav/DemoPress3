using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class Studio
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int AgentId { get; set; }
        public string Name { get; set; }
        public string StudioXml { get; set; }
        public string StudioData { get; set; }
        public Nullable<int> CallerIdId { get; set; }
        public Byte IsOutbound { get; set; }
        public Byte IsActive { get; set; }
        public String DeletedNodeIds { get; set; }
        public Int32 PurposeId { get; set; }
        public String Purpose { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedTime { get; set; }
        public Nullable<int> UpdatedBy { get; set; }
    }
}
