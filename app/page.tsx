import Image from 'next/image';

async function Fetchcard() {
  const url = `https://graph.instagram.com/me/media?fields=id,caption,username&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`;
  try {
    const data = await fetch(url);
    const feed = await data.json();
    const idforimages = [];
    for (const item of feed.data) {
      const imageResponse = await fetch(`https://graph.instagram.com/${item.id}?fields=id,media_type,media_url,username,timestamp&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`);
      const imageData = await imageResponse.json();
      idforimages.push(imageData);
    }
    return idforimages;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export default async function Home() {
  const posts = await Fetchcard() || [];
  return (
    <div className="w-screen h-screen bg-slate-500 flex flex-col items-center">
      <div className="w-full border-b-2 flex justify-center">
        <h1 className="text-white m-8 font-extrabold">Instagram Data Fetcher</h1>
      </div>
      <div className="flex flex-wrap bg-neutral-100 gap-4 justify-center p-4">
        {posts.map((item: any) => (
          <div key={item.id} className="bg-white border rounded-lg shadow-md w-80 mb-4">
            <div className="p-4 border-b">
              <h2 className="font-bold text-lg">{item.username}</h2>
            </div>
            <Image
              src={item.media_url}
              width={320}
              height={320}
              alt="Post"
              className="object-cover w-full h-80"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
