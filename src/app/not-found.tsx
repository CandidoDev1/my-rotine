import Link from "next/link";

export default function NotFound(){
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className=" text-center font-bold mt-50 text-5xl">Pagina 404 não encontrada!</h1>
            <p className="text-1xl">Está página não está disponível</p>
            <Link href='/' className="text-[#2F4E9A] mt-9 border py-3 px-3 border-gray-300 rounded-full hover:bg-gray-100">
               Voltar para a página inicial.
            </Link>
        </div>
    )
}