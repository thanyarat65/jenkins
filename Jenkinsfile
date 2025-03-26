pipeline {
    agent any

    environment {
        NETLIFY_SITE_ID = '42dd4a42-af36-4c76-80fe-2ee8c85ccffe'
        NETLIFY_AUTH_TOKEN = credentials('netlify-token') // secret in Jenkins
    }

    stages {
        stage('Build') {
            steps {
                echo "🔧 Checking required files..."
                sh '''
                    test -f index.html || (echo "Missing index.html" && exit 1)
                    test -f netlify/functions/quote.js || (echo "Missing quote function" && exit 1)
                '''
            }
        }

        stage('Test') {
            steps {
                echo "🧪 Testing quote function logic..."
                sh '''
                    node -e "const quotes = require('./netlify/functions/quote.js'); console.log('Function loaded ✅')"
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo "🚀 Deploying to Netlify..."
                sh '''
                    npm install netlify-cli
                    node_modules/.bin/netlify deploy \
                      --auth=$NETLIFY_AUTH_TOKEN \
                      --site=$NETLIFY_SITE_ID \
                      --dir=. \
                      --prod
                '''
            }
        }

        stage('Post Deploy') {
            steps {
                echo "✅ Deployment complete! App is live on Netlify."
            }
        }
    }

    post {
        success {
            echo "🎉 CI/CD pipeline finished successfully."
        }
        failure {
            echo "❌ Pipeline failed. Please check logs above."
        }
    }
}
