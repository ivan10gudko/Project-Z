
import { BadgeType } from '~/entities/user';
import { useBadges } from "~/entities/user/hooks/useBadges";
import { UserBadgeCard } from '~/entities/user/ui/UserBadgeCard';


export function AboutPage() {
  
  const { data: badges, isLoading } = useBadges();

  
  const developers = badges
    ? badges.filter((b) => b.type === BadgeType.DEVELOPER)
    : [];

  const honoredUsers = badges
    ? badges.filter((b) => b.type === BadgeType.RESPECTED)
    : [];

  return (
    <div className="page-container">
      <div className="max-w-5xl mx-auto p-6 md:p-12">
        
        
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">
            Ebliko-Hub
          </h1>
          <p className="text-foreground-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed opacity-90">
            Welcome to our cozy corner! <span className="text-primary font-semibold">Ebliko-Hub</span> is a modern platform built by anime fans, for anime fans.
          </p>
        </header>

        
        <section className="space-y-16 mb-20">
          <h2 className="text-2xl md:text-3xl font-bold border-b border-border pb-3">
            🚀 Core Features
          </h2>

          
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold">📝 Creating and Adding Titles</h3>
              <p className="text-foreground-muted leading-relaxed opacity-80">
                Found an awesome anime that is missing from our database? You can add it to Ebliko-Hub yourself! Just head over to the creation page, fill in the basic details, and upload a cover.
              </p>
            </div>
            <div className="flex-1 w-full max-w-[480px] bg-card rounded-xl overflow-hidden border border-border shadow-xl aspect-video">
              <img 
                src="/addTitle.gif" 
                alt="Creating and Adding Titles" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

         
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold">📊 Detailed Ratings & Comparison</h3>
              <p className="text-foreground-muted leading-relaxed opacity-80">
                Forget about simple star ratings — evaluate anime like a true critic! Score titles based on plot, characters, animation, and atmosphere to share your comprehensive review with the community.
              </p>
            </div>
            <div className="flex-1 w-full max-w-[480px] bg-card rounded-xl overflow-hidden border border-border shadow-xl aspect-video">
              <img 
                src="/Raiting.gif" 
                alt="Detailed Ratings & Comparison" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-4">
           
            <div className="space-y-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                🔍 Smart Filters & Sorting
              </h3>
              <p className="text-foreground-muted leading-relaxed opacity-80">
                No more chaos! Easily sort your library by date or rating. Filter titles by your current watch status (In Progress, Planned, Watched, Dropped) or choose specific content types from classic Anime to Manga.
              </p>
            </div>

            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                👥 Friends System & Profiles
              </h3>
              <p className="text-foreground-muted leading-relaxed opacity-80">
                Keep track of what your friends are watching! Add users, visit their profiles, and browse their personal watchlists. It's the best way to find new recommendations.
              </p>
            </div>
          </div>

          
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 border-t border-border/40 pt-12">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-1">
                ⚙️ In Development
              </div>
              <h3 className="text-2xl font-bold">📺 Watch Rooms</h3>
              <p className="text-foreground-muted leading-relaxed opacity-80">
                Coming soon! We are currently developing "Rooms" — a feature for synchronized anime viewing with your friends directly on the site, featuring a built-in real-time chat.
              </p>
            </div>
            <div className="flex-1 w-full max-w-[480px] bg-card rounded-xl overflow-hidden border border-border shadow-xl aspect-video flex items-center justify-center text-6xl select-none relative">
              🍿
              <span className="absolute text-xs bottom-3 text-foreground-muted opacity-50 uppercase tracking-wider font-semibold">Coming Soon</span>
            </div>
          </div>
        </section>

        
        <section className="space-y-12 border-t border-border pt-12">
          
          
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Our Team
            </h3>
            
            {isLoading ? (
              <div className="text-foreground-muted text-sm animate-pulse">Loading team...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {developers.length > 0 ? (
                  developers.map((dev) => (
                    <UserBadgeCard key={dev.id} badge={dev} variant="developer" />
                  ))
                ) : (
                  <p className="text-foreground-muted text-sm italic opacity-60">No developers found.</p>
                )}
              </div>
            )}
          </div>

         
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary"></span> Hall of Fame
            </h3>

            {isLoading ? (
              <div className="text-foreground-muted text-sm animate-pulse">Loading Hall of Fame...</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {honoredUsers.length > 0 ? (
                  honoredUsers.map((badge) => (
                    <UserBadgeCard key={badge.id} badge={badge} variant="respected" />
                  ))
                ) : (
                  <p className="text-foreground-muted text-sm italic opacity-60">The list is currently empty.</p>
                )}
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}