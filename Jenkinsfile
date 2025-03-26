pipeline {
    agent any

    environment {
        NETLIFY_SITE_ID = '42dd4a42-af36-4c76-80fe-2ee8c85ccffe'
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
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
                    npm ci

                    # Run tests with jest-junit output
                    JEST_JUNIT_OUTPUT_DIR=test-results \
                    JEST_JUNIT_OUTPUT_NAME=junit.xml \
                    npm test -- --reporters=default --reporters=jest-junit

                    echo "--- Verifying test results ---"
                    ls -R test-results || echo "❌ No test results"
                '''
            }
        }

        stage('Publish JUnit Report') {
            steps {
                echo "📄 Publishing JUnit reports..."
                junit 'test-results/junit.xml'
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
                    npm ci
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
            echo "❌ Pipeline failed. Check logs above ☝️"
        }
    }
}
