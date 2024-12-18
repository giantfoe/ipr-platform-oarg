export default function ServicesSection() {
    const services = [
      {
        title: "Business Registration",
        icon: "building",
        description: "Register your business entity in Sierra Leone"
      },
      {
        title: "Trademark Registration",
        icon: "trademark",
        description: "Protect your intellectual property rights"
      },
      {
        title: "Patent Registration",
        icon: "patent",
        description: "Secure your innovations and inventions"
      },
      // Add more services as needed
    ]
  
    return (
      <div className="bg-background-light py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-primary sm:text-4xl">
              Our Services
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Comprehensive IP registration services for Sierra Leone
            </p>
          </div>
  
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="text-center">
                  <span className="text-secondary text-4xl">
                    {/* Add your icon component here */}
                  </span>
                  <h3 className="mt-4 text-xl font-medium text-primary">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }