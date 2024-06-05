set :deploy_to, "/srv/#{fetch(:application)}/deploy"
set :static_root, "/srv/#{fetch(:application)}"
set :build_path, "pub"
set :keep_releases, 5

#staging is a deploy branch, don't work there just commit and push -f to it prior to deploying.
set :branch, "staging"

set :gulp_file, -> { release_path.join('gulpfile.js') }
set :gulp_tasks, 'staging'

server 'static', user: 'cap', roles: %w{web}

 set :ssh_options, {
   user: 'cap',
   keys: File.expand_path('~')<<"/.ssh/id_rsa",
   forward_agent: true,
   auth_methods: %w(publickey)
 }
