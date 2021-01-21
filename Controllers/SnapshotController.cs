using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using DfeJan2021DemoWebAppAndApi.Models;
using Microsoft.AspNetCore.Http;
 using DfeJan2021DemoWebAppAndApi.Database;

namespace DfeJan2021DemoWebAppAndApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Route("api/[controller]/{id?}")]
    public class SnapshotController : ControllerBase
    {

        private readonly ILogger<SnapshotController> _logger;
        private readonly ISqlServerRepository _sqlServerRepository;

        // private readonly ISqlServerRepository _sqlServerRepository;

        // private string[] _coaCodes = { "650400", "650450", "650500", "650550", "845100", "845150", "845200", "845250", "615150", "625150", "627150", "632150", "647150", "820100", "820300", "820350" };

        public SnapshotController(ILogger<SnapshotController> logger, ISqlServerRepository sqlServerRepository)
        // public SnapshotController(ILogger<SnapshotController> logger)
        {
            _logger = logger;
            _sqlServerRepository = sqlServerRepository;
        }

        [HttpGet]
        //[HttpGet("{id:int}")]
        public IEnumerable<Snapshot> Get(int id)
        {
            //var trustData = new List<Snapshot>();
            //for (int i = 1; i < 6; i++)
            //{
            //    var academyData = new List<AcademyData>();
            //    var coaData = new Dictionary<string, decimal>();
            //    var rng = new Random();
            //    var randData = Enumerable.Range(0, 16).Select(index => new KeyValuePair<string, decimal>(_coaCodes[index], (decimal)rng.Next(-20, 55)));
            //    foreach (var item in randData)
            //    {
            //        coaData.Add(item.Key, item.Value);
            //    }

            //    academyData.Add(new AcademyData { AcademyUpin = 100001, AcademyCoaData = coaData });
            //    academyData.Add(new AcademyData { AcademyUpin = 100002, AcademyCoaData = coaData });

            //    trustData.Add(new Snapshot() { Date = new DateTime(2021, i, 1), TrustCoaData = coaData, Academies = academyData });
            //}
            //return trustData;

            var snapshotQueryResult = _sqlServerRepository.GetDataSnapshot(id);

            IEnumerable<Snapshot> query = from ssqrRow in snapshotQueryResult
                                          group ssqrRow by ssqrRow.SnapshotDate into dateGroup
                                          select new Snapshot
                                          {
                                              Date = dateGroup.Key,
                                              Academies = from dgRow in dateGroup
                                                          group dgRow by dgRow.AcademyUpin into academyGroup
                                                          select new AcademyData
                                                          {
                                                              AcademyUpin = academyGroup.Key,
                                                              AcademyCoaData = academyGroup.ToDictionary(p => p.CoaAccount.ToString(), p => p.CoaAccountValue)
                                                          }
                                          };

            return query;
        }

        [HttpPut]
        //[HttpPut("{id:int}")]
        //public IEnumerable<Snapshot> Post(int id, IEnumerable<Snapshot> snapshots)
        // public IActionResult Post([FromBody]OwnerForCreationDto owner)
        //public IActionResult Put(int id, IEnumerable<Snapshot> snapshots)
        public IActionResult Put(int id, Snapshot snapshot)
        {
            try
            {
                var snapshots = snapshot.Academies
                    .SelectMany(acData => acData.AcademyCoaData, (acData, coaAccount) => new { acData, coaAccount })
                    .Select(snap =>
                        new DataSnapshot
                        {
                            SnapshotDate = snapshot.Date,
                            TrustUkprn = id,
                            AcademyUpin = snap.acData.AcademyUpin,
                            CoaAccount = Int32.Parse(snap.coaAccount.Key),
                            CoaAccountValue = snap.coaAccount.Value,
                        });

                return new OkObjectResult(_sqlServerRepository.UpsertDataSnapShots(id, snapshots));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside Snapshot->Post action: {ex.Message}");
                return StatusCode(500, "Internal server error");
                // return StatusCode(StatusCodes.Status500InternalServerError, "Error updating data");
            }
        }
    }
}
