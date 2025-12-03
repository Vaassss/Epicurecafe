import { motion } from 'motion/react';
import { Coffee, Heart, Award, Users } from 'lucide-react';

const features = [
  {
    icon: Coffee,
    title: 'Premium Quality',
    description: 'We source the finest coffee beans from sustainable farms around the world'
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Every cup is crafted by our passionate baristas who care about your experience'
  },
  {
    icon: Award,
    title: 'Award Winning',
    description: 'Recognized for excellence in coffee and customer service'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'More than a cafe, we\'re a gathering place for coffee lovers and friends'
  }
];

export function AboutSection() {
  return (
    <section className="py-20 px-4 bg-[#0f1f1b] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#a8c5a0]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#a8c5a0]/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-6xl md:text-7xl lg:text-8xl text-[#d4e4d0] mb-6"
            style={{
              fontFamily: 'Impact, Arial Black, sans-serif',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              textShadow: '4px 4px 0px rgba(168, 197, 160, 0.2)'
            }}
          >
            About Us
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="h-1 w-32 bg-[#a8c5a0] mx-auto mb-6"
          />
          <p className="text-[#a8c5a0] text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Founded in 2020, Epicure Cafe is your neighborhood sanctuary for exceptional coffee and warm hospitality. 
            We believe that every cup should be an experience worth savoring, and every visit should feel like coming home.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group"
            >
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-[#243832]/40 to-[#1a2f2a]/40 backdrop-blur-sm border border-[#a8c5a0]/20 rounded-3xl p-8 hover:border-[#a8c5a0]/60 transition-all duration-300 hover:shadow-2xl hover:shadow-[#a8c5a0]/20 h-full relative overflow-hidden"
              >
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#a8c5a0]/0 to-[#a8c5a0]/0 group-hover:from-[#a8c5a0]/5 group-hover:to-[#a8c5a0]/10 transition-all duration-500"
                />
                
                <div className="flex flex-col items-center text-center relative z-10">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6 p-5 bg-gradient-to-br from-[#a8c5a0]/20 to-[#a8c5a0]/5 rounded-2xl group-hover:from-[#a8c5a0]/30 group-hover:to-[#a8c5a0]/10 transition-all duration-300 shadow-lg shadow-[#a8c5a0]/10"
                  >
                    <feature.icon className="w-10 h-10 text-[#a8c5a0]" />
                  </motion.div>
                  <h3 
                    className="text-2xl md:text-3xl text-[#d4e4d0] mb-4"
                    style={{
                      fontFamily: 'Impact, Arial Black, sans-serif',
                      letterSpacing: '0.02em'
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-[#a8c5a0]/90 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#243832]/40 to-[#1a2f2a]/40 backdrop-blur-sm border border-[#a8c5a0]/30 rounded-[2.5rem] p-10 md:p-16 shadow-2xl shadow-[#a8c5a0]/10"
        >
          <motion.h3 
            className="text-4xl md:text-5xl lg:text-6xl text-[#d4e4d0] mb-8 text-center"
            style={{
              fontFamily: 'Impact, Arial Black, sans-serif',
              letterSpacing: '0.03em',
              textTransform: 'uppercase'
            }}
          >
            Our Story
          </motion.h3>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="h-1 w-24 bg-[#a8c5a0] mx-auto mb-10"
          />
          <div className="max-w-4xl mx-auto space-y-6 text-[#a8c5a0]/90 text-lg md:text-xl leading-relaxed">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Epicure Cafe began with a simple dream: to create a space where people could slow down, 
              connect, and enjoy truly exceptional coffee. Our founders, coffee enthusiasts with a passion 
              for quality and community, traveled the world to learn from master roasters and discover 
              the finest beans.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              Today, we're proud to be a cornerstone of our community, serving not just coffee, but 
              moments of joy, inspiration, and connection. Our loyalty program is designed to celebrate 
              our most dedicated guests, turning every visit into a step on a delicious journey.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              Join us on this adventure. Explore our menu, earn badges, and discover your new favorites. 
              Welcome to the Epicure family.
            </motion.p>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-[#a8c5a0] text-xl md:text-2xl mb-6">
            Ready to start your journey?
          </p>
          <motion.button
            onClick={() => {
              // Scroll to top then navigate to login
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => {
                const loginBtn = document.querySelector('[data-login-btn]') as HTMLButtonElement;
                loginBtn?.click();
              }, 500);
            }}
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 bg-gradient-to-r from-[#a8c5a0] to-[#8fb088] text-[#1a2f2a] rounded-full text-xl shadow-xl shadow-[#a8c5a0]/30 hover:shadow-2xl hover:shadow-[#a8c5a0]/50 transition-all duration-300 relative overflow-hidden group"
            style={{
              fontFamily: 'Impact, Arial Black, sans-serif',
              letterSpacing: '0.05em'
            }}
          >
            <span className="relative z-10">Join Our Loyalty Program</span>
            <motion.div
              className="absolute inset-0 bg-[#d4e4d0]"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
