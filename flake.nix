{
  description = "SimplifyAI Chatbot - Fullstack Dev Environment (Node.js 20)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          name = "simplifyai-dev-shell";
          buildInputs = [
            pkgs.nodejs_20
            pkgs.nodePackages.npm
            pkgs.docker
            pkgs.git
            pkgs.curl
            pkgs.openssl
            pkgs.postgresql # optional, if you use Supabase locally
          ];
          shellHook = ''
            export NODE_OPTIONS=--openssl-legacy-provider
            echo "Welcome to SimplifyAI Dev Shell!"
            echo "Node: $(node -v), NPM: $(npm -v)"
            echo "Run: npm run install:all && npm start"
          '';
        };
      });
}