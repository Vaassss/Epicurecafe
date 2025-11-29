import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { menuItems, type MenuItem } from '../data/menuData';

export function MenuSection() {

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#1a2f2a] via-[#152822] to-[#0f1f1b] relative overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -50, 0],
            opacity: [0.02, 0.05, 0.02]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#a8c5a0] rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [0, 50, 0],
            opacity: [0.02, 0.05, 0.02]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#d4e4d0] rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
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
            Our Menu
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="h-1 w-32 bg-[#a8c5a0] mx-auto mb-6"
          />
          <p className="text-[#a8c5a0] text-xl md:text-2xl">Crafted with passion, served with love</p>
        </motion.div>

        <div className="space-y-12 md:space-y-16">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.05 }}
              viewport={{ once: true, margin: "-100px" }}
              className="group"
            >
              <div className="bg-gradient-to-br from-[#243832]/40 to-[#1a2f2a]/40 backdrop-blur-sm border border-[#a8c5a0]/20 rounded-3xl p-8 md:p-10 hover:border-[#a8c5a0]/60 transition-all duration-500 hover:shadow-2xl hover:shadow-[#a8c5a0]/20 hover:bg-[#243832]/60">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                  {/* Floating 3D Product Image - No Container */}
                  <div className="relative flex-shrink-0 w-72 h-72 md:w-80 md:h-80">
                    <motion.div
                      initial={{ y: 0, rotateZ: 0 }}
                      animate={{ 
                        y: [0, -10, 0],
                        rotateZ: [0, 2, 0, -2, 0]
                      }}
                      transition={{ 
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        rotateZ: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                      }}
                      whileHover={{ 
                        y: -30,
                        rotateY: 15,
                        rotateX: -10,
                        rotateZ: 5,
                        scale: 1.15
                      }}
                      style={{ 
                        transformStyle: 'preserve-3d',
                        perspective: 1500
                      }}
                      className="relative w-full h-full cursor-pointer"
                    >
                      {/* Pure floating image with no background */}
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        style={{
                          filter: 'drop-shadow(0 30px 60px rgba(0, 0, 0, 0.6)) drop-shadow(0 15px 30px rgba(168, 197, 160, 0.3)) drop-shadow(0 5px 15px rgba(212, 228, 208, 0.2))',
                          transform: 'translateZ(40px)'
                        }}
                      />
                      
                      {/* Magical glow effect behind product */}
                      <motion.div
                        animate={{ 
                          opacity: [0.3, 0.6, 0.3],
                          scale: [0.8, 1.1, 0.8]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full blur-3xl -z-10"
                        style={{
                          background: 'radial-gradient(circle, rgba(168, 197, 160, 0.4) 0%, rgba(168, 197, 160, 0.1) 40%, transparent 70%)'
                        }}
                      />
                    </motion.div>
                    
                    {/* Dynamic shadow that follows product movement */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.05, 1],
                        opacity: [0.5, 0.7, 0.5]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-60 h-16 -z-20"
                      style={{
                        background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 30%, transparent 70%)',
                        filter: 'blur(20px)'
                      }}
                    />
                    
                    {/* Floating particles around product */}
                    <motion.div
                      animate={{ 
                        rotate: 360
                      }}
                      transition={{ 
                        duration: 25, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                      className="absolute inset-0 pointer-events-none"
                    >
                      <motion.div 
                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute top-0 left-1/4 w-3 h-3 bg-[#a8c5a0]/40 rounded-full blur-md" 
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                        className="absolute bottom-1/4 right-0 w-4 h-4 bg-[#d4e4d0]/30 rounded-full blur-md" 
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                        className="absolute top-1/3 right-1/4 w-2 h-2 bg-[#a8c5a0]/35 rounded-full blur-sm" 
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
                        className="absolute bottom-0 left-0 w-3 h-3 bg-[#d4e4d0]/25 rounded-full blur-md" 
                      />
                    </motion.div>
                    
                    {/* Sparkle effects */}
                    <motion.div
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                      className="absolute top-10 right-10 w-1 h-1 bg-[#d4e4d0] rounded-full shadow-[0_0_10px_#d4e4d0]"
                    />
                    <motion.div
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatDelay: 1,
                        delay: 0.7
                      }}
                      className="absolute bottom-20 left-14 w-1 h-1 bg-[#a8c5a0] rounded-full shadow-[0_0_10px_#a8c5a0]"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center md:text-left space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#a8c5a0]/20 to-[#a8c5a0]/10 border border-[#a8c5a0]/30 rounded-full mb-4">
                        <span className="text-[#a8c5a0] text-sm tracking-wide uppercase">{item.category}</span>
                      </div>
                    </motion.div>
                    
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      viewport={{ once: true }}
                      className="text-4xl md:text-5xl text-[#d4e4d0] mb-4"
                      style={{
                        fontFamily: 'Impact, Arial Black, sans-serif',
                        letterSpacing: '0.02em'
                      }}
                    >
                      {item.name}
                    </motion.h3>
                    
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      viewport={{ once: true }}
                      className="text-[#a8c5a0]/90 text-lg md:text-xl leading-relaxed max-w-2xl"
                    >
                      {item.description}
                    </motion.p>
                  </div>

                  {/* Price */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    viewport={{ once: true }}
                    className="flex-shrink-0"
                  >
                    <motion.div
                      whileHover={{ 
                        scale: 1.15,
                        rotate: [0, -5, 5, 0]
                      }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      <div className="bg-gradient-to-br from-[#a8c5a0]/20 to-[#a8c5a0]/5 border-3 border-[#a8c5a0] rounded-3xl px-10 py-8 group-hover:bg-[#a8c5a0] transition-all duration-300 shadow-lg shadow-[#a8c5a0]/20">
                        <p 
                          className="text-5xl text-[#d4e4d0] group-hover:text-[#1a2f2a]"
                          style={{
                            fontFamily: 'Impact, Arial Black, sans-serif'
                          }}
                        >
                          {item.price}
                        </p>
                      </div>
                      {/* Glow effect */}
                      <motion.div
                        animate={{ 
                          opacity: [0.3, 0.6, 0.3],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-[#a8c5a0]/20 rounded-3xl blur-xl -z-10"
                      />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
