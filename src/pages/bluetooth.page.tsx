import CustomButton from "@/components/common/customButton";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Stack } from "@/components/ui/stack";
import { BluetoothIcon } from "lucide-react";

declare global {
  interface Navigator {
    bluetooth?: Bluetooth;
  }
}

interface Bluetooth {
  requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>;
}

interface RequestDeviceOptions {
  acceptAllDevices?: boolean;
  filters?: BluetoothLEScanFilterInit[];
  optionalServices?: string[];
}

interface BluetoothLEScanFilterInit {
  namePrefix?: string;
  services?: string[];
}

interface BluetoothDevice {
  name: string;
  gatt?: BluetoothRemoteGATTServer;
}

interface BluetoothRemoteGATTServer {
  connect(): Promise<BluetoothRemoteGATTServer>;
}

const BluetoothPage = () => {
  const handleConnectBluetooth = async () => {
    try {
      // First check if Web Bluetooth is available
      if (!navigator.bluetooth) {
        alert(
          "Your browser doesn't support Web Bluetooth. Please use Chrome or Edge."
        );
        return;
      }

      // Request a device — acceptAllDevices: true shows all nearby BLE devices
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        // If you want to filter for specific devices, use this instead:
        // filters: [{ namePrefix: "YourDeviceName" }],
        // optionalServices: ['battery_service'] // e.g., for battery level
      });

      console.log("Connected device name:", device.name);

      // Connect to the GATT server
      const server = await device.gatt?.connect();

      if (server) {
        alert(`Successfully connected to: ${device.name}`);
        console.log("GATT Server connected:", server);
        // From here you can access services, characteristics, read/write data, etc.
      }
    } catch (error) {
      console.error("Bluetooth error:", error);
      alert("Connection failed: " + (error as Error).message);
    }
  };

  return (
    <Box className="h-screen w-full bg-[#080319] bg-[url('/general/capture-bg.png')] bg-cover bg-no-repeat flex items-center justify-center p-4">
      <Stack className="w-full max-w-[650px] max-sm:size-[90%] items-center justify-center gap-8">
        {/* Bluetooth Icon with Glow - Centered */}
        <Center
          className="w-full h-[200px] max-sm:h-[150px] relative flex items-center justify-center mt-12"
          style={{ userSelect: "none" }}
        >
          {/* Glow Effect */}
          <Box
            className="absolute top-18 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: "197.74px",
              height: "197.74px",
              background: "rgba(226, 2, 255, 0.22)",
              filter: "blur(64.6563px)",
            }}
          />
          <img
            src="/general/onlybluetooth.svg"
            alt="bluetooth"
            className="size-46 object-cover relative z-10"
          />
        </Center>

        {/* Instructions Section - No Background */}
        <Stack className="w-lg max-w-[470px] max-sm:w-full items-center justify-center border-2 border-white/10 rounded-2xl p-0">
          <Stack className="gap-2.5 items-start w-full p-4">
            <h1 className="text-[#F70353] text-xl lg:text-[2.15rem] xl:text-[1.30rem] p-0 text-center">
              Instructions:
            </h1>
            <p className="text-white/80 text-xs font-extralight tracking-widest uppercase text-center">
              1. Enable Bluetooth on your phone.
            </p>
            <p className="text-white/80 text-xs font-extralight tracking-widest uppercase text-center">
              2: Tap the button below to start pairing.
            </p>
            <p className="text-white/80 text-xs font-extralight tracking-widest uppercase text-center">
              3. Select "Kiosk AI" from your phone's Bluetooth devices
            </p>
            <p className="text-xs font-extralight tracking-widest uppercase bg-gradient-to-b from-white to-white/16 bg-clip-text text-transparent text-center">
              4. Choose an image from your gallery to send
            </p>
          </Stack>
        </Stack>

        {/* Button - Centered */}
        <CustomButton
          wrapperClassName="w-[188px] h-[48px]"
          title="Connect via Bluetooth"
          icon={<BluetoothIcon />}
          onClick={handleConnectBluetooth}
        />
      </Stack>
    </Box>
  );
};

export default BluetoothPage;
