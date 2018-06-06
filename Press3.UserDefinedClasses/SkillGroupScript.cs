using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class SkillGroupScript
    {
        public int Id { get; set; }
        public int SkillGroupId { get; set; }
        public string Title { get; set; }
        public string Script { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public int CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedTime { get; set; }
        public Nullable<int> UpdatedBy { get; set; }
    }
}
