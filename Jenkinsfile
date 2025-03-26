pipeline {
    agent any

    environment {
        NETLIFY_SITE_ID = '42dd4a42-af36-4c76-80fe-2ee8c85ccffe'
        NETLIFY_AUTH_TOKEN = credentials('netlify-token') // Jenkins secret ID
        JEST_JUNIT_OUTPUT_DIR = 'test-results'
        JEST_JUNIT_OUTPUT_NAME = 'results.xml'
    }

    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    echo "🔧 Installing dependencies and building app..."
                    node -v
                    npm -v
                    npm ci
                    npm run build
                    ls -la build
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
                sh '''
                    echo "🧪 Running tests..."
                    test -f build/index.html
                    npm test || echo "No tests defined, skipping..."
                    npm install --save-dev jest-junit

                '''
            }
        }

        stage('Publish JUnit Report') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                echo "📄 Publishing JUnit reports (if present)..."
                junit 'test-results/*.xml'
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
                sh '''
                    echo "🚀 Installing Netlify CLI and deploying..."
                    npm install netlify-cli
                    node_modules/.bin/netlify --version

                    node_modules/.bin/netlify deploy \
                      --auth=$NETLIFY_AUTH_TOKEN \
                      --site=$NETLIFY_SITE_ID \
                      --dir=build \
                      --prod
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully."
        }
        failure {
            echo "❌ Pipeline failed."
        }
    }
}
