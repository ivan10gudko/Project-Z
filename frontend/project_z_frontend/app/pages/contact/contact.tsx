import React from 'react';
import EmailIcon from '@mui/icons-material/Email';

interface ContactChannel {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode; 
  isExternal: boolean;
}

const CONTACTS_CONFIG: ContactChannel[] = [
  {
    id: 'email',
    title: 'Email',
    subtitle: 'lb.softwaresup@gmail.com',
    href: 'mailto:lb.softwaresup@gmail.com',
    icon: <EmailIcon className="text-primary w-8 h-8 md:w-9 md:h-9" />,
    isExternal: false,
  },
];

export function ContactPage() {
  return (
    <div className="page-container">
      <div className="max-w-2xl w-full mx-auto p-6 space-y-8">
        
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
            Contact Us
          </h1>
          <p className="text-foreground-muted text-lg max-w-md mx-auto leading-relaxed opacity-90">
            Have questions, suggestions, or just want to say hi? Feel free to reach out to us through any of the platforms below!
          </p>
        </header>

        <section className="flex flex-col items-center justify-center w-full">
          {CONTACTS_CONFIG.map((channel) => (
            <a 
              key={channel.id}
              href={channel.href}
              target={channel.isExternal ? "_blank" : undefined}
              rel={channel.isExternal ? "noreferrer" : undefined}
              className="flex items-center gap-6 p-6 bg-card hover:bg-accept/50 rounded-2xl border border-border shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] group max-w-md w-full"
            >
              <div className="flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shrink-0">
                {channel.icon}
              </div>
              
              <div className="space-y-1 min-w-0">
                <h4 className="font-semibold text-xs md:text-sm text-foreground-muted uppercase tracking-wider">
                  {channel.title}
                </h4>
                <p className="text-primary group-hover:underline font-bold text-lg md:text-xl transition-colors truncate">
                  {channel.subtitle}
                </p>
              </div>
            </a>
          ))}
        </section>

      </div>
    </div>
  );
}