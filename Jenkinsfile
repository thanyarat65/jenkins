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
                    echo "🔧 Build step (static validation)..."
                    ls -la
                    test -f calculatorapp/index.html || (echo "❌ index.html missing" && exit 1)
                    echo "✅ index.html found, build step complete"
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
                    echo "🧪 Test step (basic syntax check)..."
                    grep -iq "<html" calculatorapp/index.html && echo "✅ HTML tag found"
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
                sh '''
                    echo "🚀 Installing Netlify CLI and deploying..."
                    npm install netlify-cli

                    node_modules/.bin/netlify --version

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
                echo "🔄 Post-deploy step..."
                echo "✅ App successfully deployed to Netlify!"
            }
        }
    }

    post {
        success {
            echo "🎉 Pipeline finished successfully!"
        }
        failure {
            echo "❌ Pipeline failed. Check logs for details."
        }
    }
}
