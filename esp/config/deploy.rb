# config valid only for Capistrano 3.1
lock '3.2.1'

set :application, 'wfc'
set :repo_url, 'git@bitbucket.org:EMN/wfc.git'

namespace :deploy do

  #The fixperms task definition
  desc 'fix permissions on the server'
  task :fixperms
  on roles(:web) do
    execute "sudo /usr/local/sbin/fixperms #{fetch(:static_root)}"
  end

  #The actual deploy flow

  #First, build locally (Requires local build requirements are met, see the project readme for details)
  before :updated,'gulp_build_local'

  #Now that we have compiled files, upload them (local build path to remote release path)
  after :updated, 'rsync_configure'

  before :publishing, 'rsync'

  #Capistrano wants this in place, even if it does nothing
  after :publishing, :restart

    after :restart, :clear_cache do
      on roles(:web), in: :groups, limit: 3, wait: 10 do
          #might need to restart apache on static?
      end
    end

    #now that the heavy lifting is done, point the symlink for "site" to the "opub" folder that was just rsynced
  before :finishing, 'link_static_folders'

  #cleanup deployment folders
    after :finishing,'deploy:cleanup'

    #Set permissions
    after :finished, 'deploy:fixperms'
end