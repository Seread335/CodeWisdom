export default function Introduction() {
  return (
    <section className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Về IT Academy</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Chúng tôi cung cấp nền tảng học tập IT toàn diện, được thiết kế phù hợp với mọi đối tượng 
            người học từ người mới bắt đầu đến chuyên gia.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <i className="fas fa-rocket text-2xl text-primary"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Sứ mệnh</h3>
            <p className="text-gray-600">
              Trang bị kiến thức và kỹ năng IT toàn diện cho mọi người học, 
              đáp ứng nhu cầu nhân lực công nghệ trong kỷ nguyên số.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="bg-purple-100 p-3 rounded-full mb-4">
              <i className="fas fa-eye text-2xl text-secondary"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Tầm nhìn</h3>
            <p className="text-gray-600">
              Trở thành nền tảng giáo dục IT hàng đầu Việt Nam, 
              mang cơ hội học tập chất lượng cao đến mọi đối tượng người học.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <i className="fas fa-users text-2xl text-accent"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Đối tượng phục vụ</h3>
            <p className="text-gray-600">
              Học sinh, sinh viên, người trái ngành, lập trình viên muốn nâng cao kỹ năng 
              hoặc chuyển đổi công nghệ mới.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
