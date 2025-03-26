pipeline {
    agent any
    environment{
        NETLIFY_SITE_ID = '42dd4a42-af36-4c76-80fe-2ee8c85ccffe'
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
    }
    stages {
        stage('build') {
            agent{
                docker{
                    image 'node:18-alpine'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                    reuseNode true  
                }
            }
            steps {
                sh '''
                    ls -la
                    node --version
                    npm --version
                    npm ci
                    npm run build
                    ls -la
                '''
            }
        }
        stage('test'){
            agent{
                docker{
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps{
                sh '''
                test -f build/index.html
                npm test
                '''
            }
            
            
        }
        stage('Publish JUnit Report') {
            agent{
                docker{
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                junit 'test-results/*.xml'
            }
        }
        stage('deploy') {
                agent{
                    docker{
                        image 'node:18-alpine'
                        reuseNode true  
                    }
                }
                steps {
                    sh '''
                     npm install netlify-cli 
                     node_modules/.bin/netlify --version
                     echo "deploy to production"
                     node_modules/.bin/netlify status
                     node_modules/.bin/netlify deploy --dir=build --prod
                    '''
                }
            }

    }
}
