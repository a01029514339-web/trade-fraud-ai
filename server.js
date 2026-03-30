
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

function analyzeRisk(data) {
  let score = 0;

  if (!data.company) score += 30;
  if (data.newPartner) score += 20;
  if (data.urgent) score += 30;
  if (data.amount && Number(data.amount) > 100000) score += 20;

  let level = 'LOW';
  if (score >= 60) level = 'HIGH';
  else if (score >= 30) level = 'MEDIUM';

  return { score, level };
}

app.post('/analyze', (req, res) => {
  const risk = analyzeRisk(req.body);

  res.json({
    riskLevel: risk.level,
    score: risk.score,
    recommendation:
      risk.level === 'HIGH'
        ? '거래 중단 및 변호사 상담'
        : risk.level === 'MEDIUM'
        ? '주의 필요'
        : '정상 거래 가능'
  });
});

app.get('/', (req,res)=>res.send("Server running"));

app.listen(5000, () => console.log('Server running on port 5000'));
