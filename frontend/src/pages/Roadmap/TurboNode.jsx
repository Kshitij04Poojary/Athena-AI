import { Handle, Position } from '@xyflow/react'
import React from 'react'

const TurboNode = ({data, selected}) => {
  return (
    <div className={`relative rounded-xl border transition-all duration-300 w-full max-w-[16rem] sm:w-64 p-3 sm:p-5 group z-10 cursor-move ${
      selected 
        ? 'border-blue-400 bg-white shadow-2xl scale-105 ring-2 ring-blue-200' 
        : 'border-slate-200 bg-white shadow-lg hover:shadow-2xl hover:scale-[1.02]'
    }`}>
        {/* Solid background to block arrows */}
        <div className='absolute inset-0 rounded-xl bg-gradient-to-br from-white via-slate-50 to-blue-50 shadow-inner'></div>
        
        {/* Subtle glow effect */}
        <div className='absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
        
        {/* Decorative elements - smaller */}
        <div className='absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-xl'></div>
        <div className='absolute bottom-0 left-0 w-8 sm:w-12 h-8 sm:h-12 bg-gradient-to-tr from-indigo-100/30 to-transparent rounded-xl'></div>
        
        {/* Content */}
        <div className='relative z-20'>
            {/* Header with icon */}
            <div className='flex items-start gap-2 mb-2 sm:mb-3'>
                <div className='flex-shrink-0 w-6 sm:w-7 h-6 sm:h-7 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center'>
                    <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <div className='flex-1'>
                    <div className='font-bold text-sm sm:text-base text-slate-800 leading-tight'>
                        {data.title}
                    </div>
                </div>
            </div>
            
            <p className='text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4 leading-relaxed bg-white/60 rounded-lg p-2 sm:p-2.5 backdrop-blur-sm border border-slate-100' 
               style={{
                 display: '-webkit-box',
                 WebkitLineClamp: 4,
                 WebkitBoxOrient: 'vertical',
                 overflow: 'hidden',
                 textOverflow: 'ellipsis',
                 lineHeight: '1.4',
                 maxHeight: '5.6rem' // 4 lines * 1.4 line-height = 5.6rem
               }}>
                {data.description}
            </p>
            
            <div className='flex items-center justify-center'>
                <a href={data?.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md transition-all duration-200 group/link shadow-sm hover:shadow-md"
                >
                    Learn More
                    <svg className="w-2 sm:w-2.5 h-2 sm:h-2.5 transform transition-transform duration-200 group-hover/link:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>
        </div>
        
        {/* Custom handles with better styling and solid background */}
        <Handle 
            type='source' 
            position={Position.Top}
            className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-gradient-to-r from-blue-500 to-indigo-500 border-3 border-white shadow-lg z-30"
            style={{
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
            }}
        />
        <Handle 
            type='target' 
            position={Position.Bottom}
            className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-gradient-to-r from-purple-500 to-pink-500 border-3 border-white shadow-lg z-30"
            style={{
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
            }}
        />
    </div>
  )
}

export default TurboNode