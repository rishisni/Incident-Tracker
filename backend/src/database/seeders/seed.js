const { sequelize } = require('../connection');
const Incident = require('../models/Incident');
const logger = require('../../utils/logger');

const services = [
  'Payment Gateway',
  'User Authentication',
  'Database Service',
  'API Gateway',
  'Email Service',
  'File Storage',
  'Notification Service',
  'Search Engine',
  'Analytics Service',
  'CDN',
  'Load Balancer',
  'Cache Service',
  'Message Queue',
  'Monitoring Service',
  'Logging Service',
];

const severities = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];
const statuses = ['OPEN', 'MITIGATED', 'RESOLVED'];

const owners = [
  'John Smith',
  'Sarah Johnson',
  'Michael Chen',
  'Emily Davis',
  'David Wilson',
  'Lisa Anderson',
  'Robert Taylor',
  'Jennifer Martinez',
  'James Brown',
  'Maria Garcia',
  null,
];

const incidentTitles = [
  'Service degradation detected',
  'High error rate observed',
  'Response time increased significantly',
  'Database connection pool exhausted',
  'Memory leak detected in service',
  'API endpoint returning 500 errors',
  'Third-party service timeout',
  'Cache invalidation issue',
  'SSL certificate expiration warning',
  'Disk space running low',
  'Network latency spike',
  'Authentication service unavailable',
  'Data synchronization failure',
  'Queue processing backlog',
  'Rate limiting misconfiguration',
  'Missing environment variables',
  'Deployment rollback required',
  'Database query performance degradation',
  'CDN cache miss rate increased',
  'Load balancer health check failures',
];

const summaries = [
  'Users experiencing intermittent failures when accessing the service. Investigation ongoing.',
  'Error rate has increased from 0.1% to 5% over the past hour. Root cause analysis in progress.',
  'Response times have increased from 200ms to 2s. Monitoring for potential resource constraints.',
  'Database connection pool has reached maximum capacity. Scaling required.',
  'Memory usage steadily increasing over time. Potential memory leak identified.',
  'Multiple API endpoints returning 500 errors. Checking application logs.',
  'Third-party service experiencing outages. Implementing fallback mechanisms.',
  'Cache entries not being invalidated properly. Users seeing stale data.',
  'SSL certificate expires in 7 days. Renewal process initiated.',
  'Disk usage at 95% capacity. Cleanup and scaling procedures underway.',
  'Network latency increased by 300ms. Investigating network infrastructure.',
  'Authentication service completely unavailable. Users unable to log in.',
  'Data synchronization between services has failed. Manual intervention required.',
  'Message queue processing backlog of 10,000 messages. Scaling workers.',
  'Rate limiting configured incorrectly. Legitimate users being blocked.',
  'Critical environment variables missing after deployment. Rollback initiated.',
  'Recent deployment caused service instability. Rolling back to previous version.',
  'Database queries taking 10x longer than normal. Index optimization needed.',
  'CDN cache miss rate increased from 5% to 30%. Investigating cache configuration.',
  'Load balancer reporting multiple backend instances as unhealthy. Checking service health.',
];

/**
 * @template T
 * @param {T[]} array
 * @returns {T}
 */
const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * @param {Date} start
 * @param {Date} end
 * @returns {Date}
 */
const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

/**
 * @param {number} count
 * @returns {Array<import('../models/Incident').IncidentCreationAttributes>}
 */
const generateIncidents = (count) => {
  const incidents = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    const createdAt = getRandomDate(thirtyDaysAgo, now);
    const updatedAt = getRandomDate(createdAt, now);
    const severity = getRandomElement(severities);

    // Higher severity incidents are more likely to be resolved
    let status;
    if (severity === 'SEV1') {
      status = getRandomElement(['OPEN', 'MITIGATED', 'RESOLVED', 'RESOLVED', 'RESOLVED']);
    } else if (severity === 'SEV2') {
      status = getRandomElement(['OPEN', 'MITIGATED', 'RESOLVED', 'RESOLVED']);
    } else {
      status = getRandomElement(statuses);
    }

    incidents.push({
      title: `${getRandomElement(incidentTitles)} - ${getRandomElement(services)}`,
      service: getRandomElement(services),
      severity,
      status,
      owner: getRandomElement(owners),
      summary: getRandomElement(summaries),
      createdAt,
      updatedAt,
    });
  }

  return incidents;
};

const seed = async () => {
  try {
    logger.info('🔄 Connecting to database...');
    await sequelize.authenticate();
    logger.info('✅ Database connected');

    logger.info('🔄 Syncing database...');
    await sequelize.sync({ force: false });
    logger.info('✅ Database synced');

    logger.info('🔄 Clearing existing incidents...');
    await Incident.destroy({ where: {}, truncate: true });
    logger.info('✅ Existing incidents cleared');

    logger.info('🔄 Generating 200 incidents...');
    const incidents = generateIncidents(200);

    logger.info('🔄 Seeding incidents...');
    await Incident.bulkCreate(incidents);
    logger.info(`✅ Successfully seeded ${incidents.length} incidents`, {
      count: incidents.length,
    });

    // Print summary
    const counts = await Incident.findAll({
      attributes: [
        'severity',
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['severity', 'status'],
      raw: true,
    });

    logger.info('\n📊 Seeding Summary:');
    logger.info('==================');
    counts.forEach((item) => {
      logger.info(`${item.severity} - ${item.status}: ${item.count}`, {
        severity: item.severity,
        status: item.status,
        count: item.count,
      });
    });

    logger.info('\n✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.logError(error, { context: 'Database Seeding' });
    process.exit(1);
  }
};

seed();
