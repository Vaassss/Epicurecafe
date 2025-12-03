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
                  {/* Product Image - Fixed Size */}
                  <div className="relative flex-shrink-0 w-64 h-64 md:w-72 md:h-72">
                    <div className="relative w-full h-full">
                      {/* Static image with uniform sizing */}
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-2xl"
                        style={{
                          aspectRatio: '1/1'
                        }}
                      />
                    </div>
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
