pipeline {
    agent any

    environment {
        NETLIFY_SITE_ID = '31643a85-f944-4a31-adac-1f60d8e42c01'
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "📥 Checking out source code..."
                checkout scm
            }
        }

        stage('Build') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                echo "🔧 Checking required files..."
                sh '''
                    set -e  # Stop script on error
                    [[ -f index.html ]] || { echo "❌ Missing index.html"; exit 1; }
                    [[ -f netlify/functions/quote.js ]] || { echo "❌ Missing quote function"; exit 1; }
                    echo "✅ Build check passed."
                '''
            }
        }

        stage('Test') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                echo "🧪 Running tests..."
                sh '''
                    set -e
                    node -e "require('./netlify/functions/quote.js'); console.log('✅ Function loaded successfully')"
                    echo "✅ All tests passed."
                '''
            }
        }

        stage('Deploy') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                echo "🚀 Deploying to Netlify..."
                sh '''
                    set -e
                    npx netlify-cli deploy \
                      --auth=$NETLIFY_AUTH_TOKEN \
                      --site=$NETLIFY_SITE_ID \
                      --dir=. \
                      --prod
                '''
            }
        }

        stage('Cleanup') {
            steps {
                echo "🧹 Cleaning up..."
                sh 'rm -rf node_modules'
            }
        }

        stage('Post Deploy') {
            steps {
                echo "✅ Deployment complete! Your app is live."
            }
        }
    }

    post {
        success {
            echo "🎉 CI/CD pipeline finished successfully."
        }
        failure {
            echo "❌ Pipeline failed. Check logs for details."
        }
    }
}
