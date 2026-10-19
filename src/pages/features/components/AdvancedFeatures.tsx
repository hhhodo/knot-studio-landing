
import { motion } from 'framer-motion';

export default function AdvancedFeatures() {
  const features = [
    {
      title: 'Natural Language Queries',
      description: 'Ask questions in plain English and get instant answers. Our AI understands context and intent, making data exploration as easy as having a conversation.',
      icon: 'ri-chat-3-line',
      image: '/knot-studio-landing/images/nlp-feature.jpg',
      capabilities: [
        'Natural language processing for intuitive queries',
        'Context-aware AI that remembers conversation history',
        'Support for complex multi-step questions',
        'Instant visualization of query results'
      ]
    },
    {
      title: 'Automated Report Generation',
      description: 'Schedule reports to be generated and delivered automatically. Customize templates, set delivery schedules, and ensure stakeholders always have the latest insights.',
      icon: 'ri-file-chart-line',
      image: '/knot-studio-landing/images/report-feature.jpg',
      capabilities: [
        'Flexible scheduling with custom time zones',
        'Customizable report templates and branding',
        'Multiple delivery channels (email, Slack, etc.)',
        'Automatic data refresh before generation'
      ]
    },
    {
      title: 'Custom Visualizations',
      description: 'Create stunning custom visualizations with our advanced charting engine. From basic bar charts to complex network diagrams, bring your data to life.',
      icon: 'ri-pie-chart-line',
      image: '/knot-studio-landing/images/viz-feature.jpg',
      capabilities: [
        '50+ chart types and visualization options',
        'Interactive and responsive charts',
        'Export to multiple formats (PNG, PDF, SVG)',
        'Custom color schemes and themes'
      ]
    },
    {
      title: 'Data Quality Monitoring',
      description: 'Automatically detect and alert on data quality issues. Track completeness, accuracy, and consistency across all your data sources.',
      icon: 'ri-shield-check-line',
      image: '/knot-studio-landing/images/quality-feature.jpg',
      capabilities: [
        'Automatic anomaly detection and alerts',
        'Data completeness and accuracy tracking',
        'Custom validation rules and thresholds',
        'Historical quality trend analysis'
      ]
    }
  ];

  return (
    <section className="py-24 bg-brand-beige-light">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-caprasimo mb-6 text-brand-black">
            Advanced Capabilities
          </h2>
          <p className="text-xl text-brand-grey max-w-3xl mx-auto">
            Take your analytics to the next level with cutting-edge features
          </p>
        </motion.div>

        <div className="space-y-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-brand-beige hover:border-brand-green transition-all"
            >
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className={`p-12 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="w-16 h-16 flex items-center justify-center bg-brand-beige-light rounded-xl mb-6">
                    <i className={`${feature.icon} text-3xl text-brand-green`}></i>
                  </div>
                  <h3 className="text-3xl font-caprasimo mb-4 text-brand-black">
                    {feature.title}
                  </h3>
                  <p className="text-brand-grey leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.capabilities.map((capability, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 flex items-center justify-center bg-brand-green/10 rounded-full flex-shrink-0 mt-0.5">
                          <i className="ri-check-line text-xs text-brand-green"></i>
                        </div>
                        <span className="text-brand-grey">{capability}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-96 lg:h-full object-cover object-top"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
