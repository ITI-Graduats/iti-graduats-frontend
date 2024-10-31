import { ErrorModelProvider } from "./contexts/ErrorModelProvider"; // استيراد مزود السياق
import MultiStepForm from "./pages/MultiStepForm"; // استيراد النموذج المتعدد الخطوات

function App() {
  return (
    <>
      <ErrorModelProvider> {/* تغليف المكونات بمزود السياق */}
        <MultiStepForm />
      </ErrorModelProvider>
    </>
  );
}

export default App;
