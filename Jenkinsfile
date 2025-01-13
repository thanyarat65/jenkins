pipeline {
    agent any
    environment{
        NETIFY_SITE_ID = '42dd4a42-af36-4c76-80fe-2ee8c85ccffe'
    }
    stages {
        stage('build') {
            agent{
                docker{
                    image 'node:18-alpine'
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
                     node_modules/.bin/netify --version
                    '''
                }
            }

    }
}
